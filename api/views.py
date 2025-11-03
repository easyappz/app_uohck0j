from typing import Any, Dict, List

from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .authentication import JWTAuthentication
from .permissions import IsAdOwnerOrModerator
from .pagination import DefaultPagination
from .utils.jwt import encode_jwt, decode_jwt
from .filters import CarAdFilter
from .models import (
    UserProfile,
    CarMake,
    CarModel,
    BodyType,
    FuelType,
    TransmissionType,
    DriveType,
    Color,
    City,
    Feature,
    CarAd,
    CarImage,
    Favorite,
)
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    TokenSerializer,
    ProfileSerializer,
    CarAdBaseSerializer,
    CarAdListSerializer,
    CarAdDetailSerializer,
    CarImageSerializer,
    FavoriteSerializer,
    ContactRequestSerializer,
    CarMakeSerializer,
    CarModelSerializer,
    BodyTypeSerializer,
    FuelTypeSerializer,
    TransmissionTypeSerializer,
    DriveTypeSerializer,
    ColorSerializer,
    CitySerializer,
    FeatureSerializer,
)

User = get_user_model()

ACCESS_TOKEN_MINUTES = 15
REFRESH_TOKEN_MINUTES = 60 * 24 * 30  # 30 days


def _generate_tokens(user: User) -> Dict[str, Any]:
    access = encode_jwt({"sub": user.id, "type": "access"}, exp_minutes=ACCESS_TOKEN_MINUTES)
    refresh = encode_jwt({"sub": user.id, "type": "refresh"}, exp_minutes=REFRESH_TOKEN_MINUTES)
    return {
        "access": access,
        "refresh": refresh,
        "expires_in": ACCESS_TOKEN_MINUTES * 60,
    }


# Auth endpoints
class RegisterView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=RegisterSerializer, responses={201: TokenSerializer})
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = _generate_tokens(user)
        return Response(tokens, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=LoginSerializer, responses={200: TokenSerializer})
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        login = serializer.validated_data["login"]
        password = serializer.validated_data["password"]

        user = None
        if "@" in login:
            try:
                user = User.objects.get(email__iexact=login)
                user = authenticate(request, username=user.username, password=password)
            except User.DoesNotExist:
                user = None
        else:
            user = authenticate(request, username=login, password=password)

        if not user:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        tokens = _generate_tokens(user)
        return Response(tokens)


class RefreshView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=TokenSerializer, responses={200: TokenSerializer})
    def post(self, request):
        refresh = request.data.get("refresh")
        if not refresh:
            return Response({"detail": "refresh token required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            payload = decode_jwt(refresh)
        except ValueError:
            return Response({"detail": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)
        if payload.get("type") != "refresh":
            return Response({"detail": "Invalid token type"}, status=status.HTTP_400_BAD_REQUEST)
        user_id = payload.get("sub")
        user = get_object_or_404(User, pk=user_id)
        tokens = _generate_tokens(user)
        return Response(tokens)


class MeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: ProfileSerializer})
    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        data = ProfileSerializer(profile).data
        return Response(data)


# Ads endpoints
class AdsListCreateView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    pagination_class = DefaultPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = CarAdFilter
    ordering_fields = ["price", "year", "created_at"]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def _base_queryset(self):
        return (
            CarAd.objects.all()
            .select_related(
                "seller",
                "make",
                "model",
                "body_type",
                "fuel_type",
                "transmission_type",
                "drive_type",
                "color",
                "city",
            )
            .prefetch_related("images", "features")
        )

    def get_queryset(self):
        qs = self._base_queryset()
        mine = (self.request.query_params.get("mine") or "").lower() in {"1", "true", "yes"}
        if mine:
            user = getattr(self.request, "user", None)
            if user and user.is_authenticated:
                return qs.filter(seller=user)
            # If not authenticated, return empty set to avoid leaking data
            return qs.none()
        # Public catalog shows only active ads
        return qs.filter(is_active=True)

    def get_serializer_class(self):
        if self.request and self.request.method == "GET":
            return CarAdListSerializer
        return CarAdBaseSerializer

    @extend_schema(
        parameters=[
            OpenApiParameter(name="q", description="Search in title/description", required=False, type=str),
            OpenApiParameter(name="make", description="Car make id", required=False, type=int),
            OpenApiParameter(name="model", description="Car model id", required=False, type=int),
            OpenApiParameter(name="year_min", description="Min year", required=False, type=int),
            OpenApiParameter(name="year_max", description="Max year", required=False, type=int),
            OpenApiParameter(name="price_min", description="Min price", required=False, type=str),
            OpenApiParameter(name="price_max", description="Max price", required=False, type=str),
            OpenApiParameter(name="mileage_max", description="Max mileage", required=False, type=int),
            OpenApiParameter(name="transmission_type", description="Transmission type id", required=False, type=int),
            OpenApiParameter(name="fuel_type", description="Fuel type id", required=False, type=int),
            OpenApiParameter(name="body_type", description="Body type id", required=False, type=int),
            OpenApiParameter(name="drive_type", description="Drive type id", required=False, type=int),
            OpenApiParameter(name="color", description="Color id", required=False, type=int),
            OpenApiParameter(name="city", description="City id", required=False, type=int),
            OpenApiParameter(name="features", description="Feature ids CSV (e.g. 1,2,3)", required=False, type=str),
            OpenApiParameter(name="ordering", description="Order by price|year|created_at (prefix with - for desc)", required=False, type=str),
            OpenApiParameter(name="mine", description="If true, return only current user's ads", required=False, type=bool),
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(request=CarAdBaseSerializer, responses={201: CarAdBaseSerializer})
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        ad = serializer.save(seller=self.request.user)
        features_ids = self.request.data.get("features")
        if isinstance(features_ids, list):
            ad.features.set(Feature.objects.filter(id__in=features_ids))


class AdDetailView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdOwnerOrModerator]

    queryset = (
        CarAd.objects.all()
        .select_related(
            "seller",
            "make",
            "model",
            "body_type",
            "fuel_type",
            "transmission_type",
            "drive_type",
            "color",
            "city",
        )
        .prefetch_related("images", "features")
    )

    def get_serializer_class(self):
        if self.request and self.request.method == "GET":
            return CarAdDetailSerializer
        return CarAdBaseSerializer

    @extend_schema(responses={200: CarAdDetailSerializer})
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(request=CarAdDetailSerializer, responses={200: CarAdDetailSerializer})
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @extend_schema(responses={204: None})
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class AdImagesUploadView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    MAX_IMAGES_PER_AD = 10
    MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB

    @extend_schema(request=None, responses={201: CarImageSerializer})
    def post(self, request, id: int):
        ad = get_object_or_404(CarAd, pk=id)
        # Check permissions manually similar to IsAdOwnerOrModerator
        role = getattr(getattr(request.user, "profile", None), "role", "user")
        if not (ad.seller_id == request.user.id or role in ("moderator", "admin") or request.user.is_staff or request.user.is_superuser):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        files = request.FILES.getlist("images") or ([request.FILES.get("image")] if request.FILES.get("image") else [])
        if not files:
            return Response({"detail": "No files provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate total count
        existing_count = ad.images.count()
        if existing_count + len(files) > self.MAX_IMAGES_PER_AD:
            return Response({"detail": f"Maximum {self.MAX_IMAGES_PER_AD} images per ad"}, status=status.HTTP_400_BAD_REQUEST)

        created: List[Dict[str, Any]] = []
        for f in files:
            # Basic validations: content type and size
            content_type = getattr(f, "content_type", "") or ""
            if not content_type.startswith("image/"):
                return Response({"detail": "Only image files are allowed"}, status=status.HTTP_400_BAD_REQUEST)
            if getattr(f, "size", 0) > self.MAX_IMAGE_SIZE:
                return Response({"detail": "Image is too large (max 5MB)"}, status=status.HTTP_400_BAD_REQUEST)
            img = CarImage.objects.create(ad=ad, image=f)
            created.append(CarImageSerializer(img, context={"request": request}).data)
        return Response({"images": created}, status=status.HTTP_201_CREATED)


class FavoriteToggleView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={201: FavoriteSerializer})
    def post(self, request, id: int):
        ad = get_object_or_404(CarAd, pk=id)
        fav, created = Favorite.objects.get_or_create(user=request.user, ad=ad)
        if created:
            return Response(FavoriteSerializer(fav).data, status=status.HTTP_201_CREATED)
        return Response(FavoriteSerializer(fav).data, status=status.HTTP_200_OK)

    @extend_schema(responses={204: None})
    def delete(self, request, id: int):
        ad = get_object_or_404(CarAd, pk=id)
        Favorite.objects.filter(user=request.user, ad=ad).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class FavoritesListView(ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = DefaultPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = CarAdFilter
    ordering_fields = ["price", "year", "created_at"]

    serializer_class = CarAdListSerializer

    def get_queryset(self):
        return (
            CarAd.objects.filter(favorited_by__user=self.request.user)
            .select_related(
                "seller",
                "make",
                "model",
                "body_type",
                "fuel_type",
                "transmission_type",
                "drive_type",
                "color",
                "city",
            )
            .prefetch_related("images", "features")
        )


class ContactRequestCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]

    @extend_schema(request=ContactRequestSerializer, responses={201: ContactRequestSerializer})
    def post(self, request, id: int):
        ad = get_object_or_404(CarAd, pk=id)
        serializer = ContactRequestSerializer(data=request.data, context={"request": request, "ad": ad})
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        return Response(ContactRequestSerializer(obj).data, status=status.HTTP_201_CREATED)


# Meta endpoints
class MetaOptionsView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(responses={200: None})
    def get(self, request):
        data = {
            "makes": CarMakeSerializer(CarMake.objects.all(), many=True).data,
            "models": CarModelSerializer(CarModel.objects.select_related("make").all(), many=True).data,
            "body_types": BodyTypeSerializer(BodyType.objects.all(), many=True).data,
            "fuel_types": FuelTypeSerializer(FuelType.objects.all(), many=True).data,
            "transmission_types": TransmissionTypeSerializer(TransmissionType.objects.all(), many=True).data,
            "drive_types": DriveTypeSerializer(DriveType.objects.all(), many=True).data,
            "colors": ColorSerializer(Color.objects.all(), many=True).data,
            "cities": CitySerializer(City.objects.all(), many=True).data,
            "features": FeatureSerializer(Feature.objects.all(), many=True).data,
        }
        return Response(data)


class MetaModelsByMakeView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(parameters=[OpenApiParameter(name="make_id", required=True, type=int, location=OpenApiParameter.QUERY)])
    def get(self, request):
        make_id = request.query_params.get("make_id")
        if not make_id:
            return Response({"detail": "make_id required"}, status=status.HTTP_400_BAD_REQUEST)
        models_qs = CarModel.objects.filter(make_id=make_id).select_related("make")
        data = CarModelSerializer(models_qs, many=True).data
        return Response(data)
