from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class NamedModel(models.Model):
    name = models.CharField(max_length=128, unique=True)

    class Meta:
        abstract = True
        ordering = ["name"]

    def __str__(self) -> str:  # pragma: no cover
        return self.name


class UserProfile(models.Model):
    class Roles(models.TextChoices):
        USER = "user", "User"
        MODERATOR = "moderator", "Moderator"
        ADMIN = "admin", "Admin"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=16, choices=Roles.choices, default=Roles.USER)

    def __str__(self) -> str:  # pragma: no cover
        return f"Profile({self.user.username}, {self.role})"


class CarMake(NamedModel):
    pass


class CarModel(models.Model):
    make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name="car_models")
    name = models.CharField(max_length=128)

    class Meta:
        unique_together = ("make", "name")
        ordering = ["make__name", "name"]

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.make.name} {self.name}"


class BodyType(NamedModel):
    pass


class FuelType(NamedModel):
    pass


class TransmissionType(NamedModel):
    pass


class DriveType(NamedModel):
    pass


class Color(NamedModel):
    pass


class City(NamedModel):
    pass


class Feature(NamedModel):
    pass


class CarAd(TimeStampedModel):
    class Condition(models.TextChoices):
        NEW = "new", "New"
        USED = "used", "Used"

    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name="car_ads")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    price = models.DecimalField(max_digits=12, decimal_places=2)
    year = models.PositiveIntegerField()
    mileage = models.PositiveIntegerField(help_text="Mileage in km")
    engine_volume = models.DecimalField(max_digits=4, decimal_places=1, help_text="Liters, e.g. 2.0")
    power = models.PositiveIntegerField(help_text="HP")
    vin = models.CharField(max_length=32, blank=True, null=True)
    condition = models.CharField(max_length=8, choices=Condition.choices, default=Condition.USED)

    make = models.ForeignKey(CarMake, on_delete=models.PROTECT, related_name="ads")
    model = models.ForeignKey(CarModel, on_delete=models.PROTECT, related_name="ads")
    body_type = models.ForeignKey(BodyType, on_delete=models.PROTECT, related_name="ads")
    fuel_type = models.ForeignKey(FuelType, on_delete=models.PROTECT, related_name="ads")
    transmission_type = models.ForeignKey(TransmissionType, on_delete=models.PROTECT, related_name="ads")
    drive_type = models.ForeignKey(DriveType, on_delete=models.PROTECT, related_name="ads")
    color = models.ForeignKey(Color, on_delete=models.PROTECT, related_name="ads")
    city = models.ForeignKey(City, on_delete=models.PROTECT, related_name="ads")

    features = models.ManyToManyField(Feature, blank=True, related_name="ads")

    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["is_active", "created_at"]),
            models.Index(fields=["price"]),
            models.Index(fields=["year"]),
        ]

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.title} ({self.make} {self.model})"


class CarImage(models.Model):
    ad = models.ForeignKey(CarAd, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="ads/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:  # pragma: no cover
        return f"Image for ad #{self.ad_id}"


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    ad = models.ForeignKey(CarAd, on_delete=models.CASCADE, related_name="favorited_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "ad")

    def __str__(self) -> str:  # pragma: no cover
        return f"Favorite(user={self.user_id}, ad={self.ad_id})"


class ContactRequest(models.Model):
    ad = models.ForeignKey(CarAd, on_delete=models.CASCADE, related_name="contact_requests")
    buyer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="contact_requests")
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=32)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:  # pragma: no cover
        return f"ContactRequest(ad={self.ad_id}, name={self.name})"
