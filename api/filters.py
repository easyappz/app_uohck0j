from django.db.models import Q
from django_filters import rest_framework as filters

from .models import CarAd, CarMake, CarModel, BodyType, FuelType, TransmissionType, DriveType, Color, City, Feature


class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    pass


class CarAdFilter(filters.FilterSet):
    q = filters.CharFilter(method="filter_q")

    make = filters.ModelChoiceFilter(queryset=CarMake.objects.all())
    model = filters.ModelChoiceFilter(queryset=CarModel.objects.select_related("make").all())

    year_min = filters.NumberFilter(field_name="year", lookup_expr="gte")
    year_max = filters.NumberFilter(field_name="year", lookup_expr="lte")

    price_min = filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = filters.NumberFilter(field_name="price", lookup_expr="lte")

    mileage_max = filters.NumberFilter(field_name="mileage", lookup_expr="lte")

    transmission_type = filters.ModelChoiceFilter(queryset=TransmissionType.objects.all())
    fuel_type = filters.ModelChoiceFilter(queryset=FuelType.objects.all())
    body_type = filters.ModelChoiceFilter(queryset=BodyType.objects.all())
    drive_type = filters.ModelChoiceFilter(queryset=DriveType.objects.all())
    color = filters.ModelChoiceFilter(queryset=Color.objects.all())
    city = filters.ModelChoiceFilter(queryset=City.objects.all())

    # Accepts CSV list: features=1,2,3 and filters ads that include ALL selected features
    features = NumberInFilter(field_name="features__id", distinct=True, conjoined=True)

    class Meta:
        model = CarAd
        fields = [
            "q",
            "make",
            "model",
            "year_min",
            "year_max",
            "price_min",
            "price_max",
            "mileage_max",
            "transmission_type",
            "fuel_type",
            "body_type",
            "drive_type",
            "color",
            "city",
            "features",
        ]

    def filter_q(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(
            Q(title__icontains=value) | Q(description__icontains=value)
        ).distinct()
