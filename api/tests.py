from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework.test import APIClient

from api.models import (
    CarMake,
    CarModel,
    BodyType,
    FuelType,
    TransmissionType,
    DriveType,
    Color,
    City,
    CarAd,
    CarImage,
)
from api.serializers import CarAdBaseSerializer

User = get_user_model()


class BaseFixturesMixin:
    def setUp(self):
        super().setUp()
        # Users
        self.user = User.objects.create_user(username="u1", email="u1@example.com", password="pass12345")
        self.other = User.objects.create_user(username="u2", email="u2@example.com", password="pass12345")
        # Dictionaries
        self.mk_toyota = CarMake.objects.create(name="Toyota")
        self.mk_bmw = CarMake.objects.create(name="BMW")
        self.m_camry = CarModel.objects.create(make=self.mk_toyota, name="Camry")
        self.body = BodyType.objects.create(name="Sedan")
        self.fuel = FuelType.objects.create(name="Petrol")
        self.trans = TransmissionType.objects.create(name="AT")
        self.drive = DriveType.objects.create(name="FWD")
        self.color = Color.objects.create(name="Black")
        self.city = City.objects.create(name="Moscow")


class SerializerValidationTests(BaseFixturesMixin, TestCase):
    def test_model_must_belong_to_make(self):
        data = {
            "title": "Test",
            "description": "",
            "price": "10000.00",
            "year": 2020,
            "mileage": 10000,
            "engine_volume": "2.0",
            "power": 150,
            "vin": "",
            "condition": "used",
            "make": self.mk_bmw.id,  # Wrong make
            "model": self.m_camry.id,  # Camry belongs to Toyota
            "body_type": self.body.id,
            "fuel_type": self.fuel.id,
            "transmission_type": self.trans.id,
            "drive_type": self.drive.id,
            "color": self.color.id,
            "city": self.city.id,
            "features": [],
            "is_active": True,
        }
        serializer = CarAdBaseSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("model", serializer.errors)


class ImageUploadLimitTests(BaseFixturesMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.ad = CarAd.objects.create(
            seller=self.user,
            title="A",
            description="",
            price="10000.00",
            year=2020,
            mileage=10000,
            engine_volume="2.0",
            power=150,
            vin="",
            condition="used",
            make=self.mk_toyota,
            model=self.m_camry,
            body_type=self.body,
            fuel_type=self.fuel,
            transmission_type=self.trans,
            drive_type=self.drive,
            color=self.color,
            city=self.city,
            is_active=True,
        )
        # Pre-fill with 10 images
        for i in range(10):
            CarImage.objects.create(
                ad=self.ad,
                image=SimpleUploadedFile(f"i{i}.jpg", b"\x47\x49\x46\x38", content_type="image/jpeg"),
            )

    def test_cannot_exceed_10_images(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        file_obj = SimpleUploadedFile("more.jpg", b"\x47\x49\x46\x38", content_type="image/jpeg")
        resp = client.post(f"/api/ads/{self.ad.id}/images", data={"image": file_obj}, format="multipart")
        self.assertEqual(resp.status_code, 400)
        self.assertIn("Maximum 10 images per ad", str(resp.data))


class FavoritesIdempotentTests(BaseFixturesMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.ad = CarAd.objects.create(
            seller=self.other,
            title="Fav",
            description="",
            price="10000.00",
            year=2021,
            mileage=5000,
            engine_volume="2.0",
            power=150,
            vin="",
            condition="used",
            make=self.mk_toyota,
            model=self.m_camry,
            body_type=self.body,
            fuel_type=self.fuel,
            transmission_type=self.trans,
            drive_type=self.drive,
            color=self.color,
            city=self.city,
            is_active=True,
        )

    def test_add_favorite_is_idempotent(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        r1 = client.post(f"/api/ads/{self.ad.id}/favorite")
        self.assertEqual(r1.status_code, 201)
        r2 = client.post(f"/api/ads/{self.ad.id}/favorite")
        self.assertEqual(r2.status_code, 200)
