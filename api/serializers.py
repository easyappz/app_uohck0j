from typing import Any
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

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
    ContactRequest,
)

User = get_user_model()


# Auth serializers
class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)

    def validate_username(self, value: str) -> str:
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value: str) -> str:
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def create(self, validated_data: dict) -> User:
        user = User(
            username=validated_data["username"],
            email=validated_data["email"],
            password=make_password(validated_data["password"]),
        )
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    login = serializers.CharField()  # username or email
    password = serializers.CharField(write_only=True)


class TokenSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    expires_in = serializers.IntegerField(help_text="Access token lifetime in seconds")


class ProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="user.id", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = UserProfile
        fields = ("id", "username", "email", "role")


# Reference serializers
class IdNameSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ("id", "name")


class CarMakeSerializer(IdNameSerializer):
    class Meta(IdNameSerializer.Meta):
        model = CarMake


class CarModelSerializer(serializers.ModelSerializer):
    make = CarMakeSerializer(read_only=True)

    class Meta:
        model = CarModel
        fields = ("id", "name", "make")


class BodyTypeSerializer(IdNameSerializer):
    class Meta(IdNameSerializer.Meta):
        model = BodyType


class FuelTypeSerializer(IdNameSerializer):
    class Meta(IdNameSerializer.Meta):
        model = FuelType


class TransmissionTypeSerializer(IdNameSerializer):
    class Meta(IdNameSerializer.Meta):
        model = TransmissionType


class DriveTypeSerializer(IdNameSerializer):
    class Meta(IdNameSerializer.Meta):
        model = DriveType


class ColorSerializer(IdNameSerializer):
    class Meta(IdNameSerializer.Meta):
        model = Color


class CitySerializer(IdNameSerializer):
    class Meta(IdNameSerializer.Meta):
        model = City


class FeatureSerializer(IdNameSerializer):
    class Meta(IdNameSerializer.Meta):
        model = Feature


# Ads serializers
class CarImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = CarImage
        fields = ("id", "image", "image_url", "created_at")
        read_only_fields = ("id", "image_url", "created_at")

    def get_image_url(self, obj: CarImage) -> str:
        request = self.context.get("request")
        if not obj.image:
            return ""
        if request is not None:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class CarAdBaseSerializer(serializers.ModelSerializer):
    make = serializers.PrimaryKeyRelatedField(queryset=CarMake.objects.all())
    model = serializers.PrimaryKeyRelatedField(queryset=CarModel.objects.all())
    body_type = serializers.PrimaryKeyRelatedField(queryset=BodyType.objects.all())
    fuel_type = serializers.PrimaryKeyRelatedField(queryset=FuelType.objects.all())
    transmission_type = serializers.PrimaryKeyRelatedField(queryset=TransmissionType.objects.all())
    drive_type = serializers.PrimaryKeyRelatedField(queryset=DriveType.objects.all())
    color = serializers.PrimaryKeyRelatedField(queryset=Color.objects.all())
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all())
    features = serializers.PrimaryKeyRelatedField(queryset=Feature.objects.all(), many=True, required=False)

    class Meta:
        model = CarAd
        fields = (
            "id",
            "title",
            "description",
            "price",
            "year",
            "mileage",
            "engine_volume",
            "power",
            "vin",
            "condition",
            "make",
            "model",
            "body_type",
            "fuel_type",
            "transmission_type",
            "drive_type",
            "color",
            "city",
            "features",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def validate(self, attrs: dict) -> dict:
        make = attrs.get("make") or getattr(self.instance, "make", None)
        model = attrs.get("model") or getattr(self.instance, "model", None)
        if make and model and model.make_id != make.id:
            raise serializers.ValidationError({"model": _("Selected model does not belong to the selected make")})
        return attrs


class CarAdListSerializer(CarAdBaseSerializer):
    make = CarMakeSerializer(read_only=True)
    model = CarModelSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    thumbnail = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()

    class Meta(CarAdBaseSerializer.Meta):
        fields = CarAdBaseSerializer.Meta.fields + ("thumbnail", "is_favorite")

    def get_thumbnail(self, obj: CarAd) -> str:
        request = self.context.get("request")
        image = obj.images.first()
        if not image or not image.image:
            return ""
        if request is not None:
            return request.build_absolute_uri(image.image.url)
        return image.image.url

    def get_is_favorite(self, obj: CarAd) -> bool:
        user = self.context.get("request").user if self.context.get("request") else None
        if not user or not user.is_authenticated:
            return False
        return Favorite.objects.filter(user=user, ad=obj).exists()


class CarAdDetailSerializer(CarAdBaseSerializer):
    seller = serializers.SerializerMethodField()
    make = CarMakeSerializer(read_only=True)
    model = CarModelSerializer(read_only=True)
    body_type = BodyTypeSerializer(read_only=True)
    fuel_type = FuelTypeSerializer(read_only=True)
    transmission_type = TransmissionTypeSerializer(read_only=True)
    drive_type = DriveTypeSerializer(read_only=True)
    color = ColorSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    features = FeatureSerializer(many=True, read_only=True)
    images = CarImageSerializer(many=True, read_only=True)

    class Meta(CarAdBaseSerializer.Meta):
        fields = CarAdBaseSerializer.Meta.fields + (
            "seller",
            "images",
        )

    def get_seller(self, obj: CarAd) -> dict:
        return {
            "id": obj.seller_id,
            "username": getattr(obj.seller, "username", ""),
        }


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ("id", "ad", "created_at")
        read_only_fields = ("id", "created_at")


class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = ("id", "name", "phone", "message", "created_at")
        read_only_fields = ("id", "created_at")

    def create(self, validated_data: dict) -> ContactRequest:
        ad = self.context["ad"]
        buyer = None
        request = self.context.get("request")
        if request and request.user and request.user.is_authenticated:
            buyer = request.user
        return ContactRequest.objects.create(ad=ad, buyer=buyer, **validated_data)
