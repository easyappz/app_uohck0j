from django.contrib import admin
from . import models


@admin.register(models.UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role")
    list_filter = ("role",)
    search_fields = ("user__username", "user__email")


@admin.register(models.CarMake)
class CarMakeAdmin(admin.ModelAdmin):
    search_fields = ("name",)


@admin.register(models.CarModel)
class CarModelAdmin(admin.ModelAdmin):
    list_display = ("name", "make")
    list_filter = ("make",)
    search_fields = ("name", "make__name")


@admin.register(models.BodyType, models.FuelType, models.TransmissionType, models.DriveType, models.Color, models.City, models.Feature)
class SimpleDictAdmin(admin.ModelAdmin):
    search_fields = ("name",)


class CarImageInline(admin.TabularInline):
    model = models.CarImage
    extra = 0


@admin.register(models.CarAd)
class CarAdAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "seller", "price", "year", "is_active", "created_at")
    list_filter = ("is_active", "make", "model", "city", "fuel_type", "transmission_type")
    search_fields = ("title", "description", "vin", "seller__username")
    inlines = [CarImageInline]


@admin.register(models.Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ("user", "ad", "created_at")
    search_fields = ("user__username", "ad__title")


@admin.register(models.ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ("ad", "name", "phone", "buyer", "created_at")
    search_fields = ("name", "phone", "ad__title", "buyer__username")
    list_filter = ("created_at",)
