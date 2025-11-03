from django.db import migrations


def seed_data(apps, schema_editor):
    BodyType = apps.get_model('api', 'BodyType')
    FuelType = apps.get_model('api', 'FuelType')
    TransmissionType = apps.get_model('api', 'TransmissionType')
    DriveType = apps.get_model('api', 'DriveType')
    Color = apps.get_model('api', 'Color')
    City = apps.get_model('api', 'City')
    CarMake = apps.get_model('api', 'CarMake')
    CarModel = apps.get_model('api', 'CarModel')

    for name in [
        'седан', 'хэтчбек', 'универсал', 'купе', 'кроссовер', 'внедорожник', 'пикап', 'минивэн'
    ]:
        BodyType.objects.get_or_create(name=name)

    for name in ['бензин', 'дизель', 'гибрид', 'электро', 'газ']:
        FuelType.objects.get_or_create(name=name)

    for name in ['МКПП', 'АКПП', 'вариатор', 'робот']:
        TransmissionType.objects.get_or_create(name=name)

    for name in ['передний', 'задний', 'полный']:
        DriveType.objects.get_or_create(name=name)

    for name in ['чёрный', 'белый', 'серебристый', 'синий', 'красный', 'серый']:
        Color.objects.get_or_create(name=name)

    for name in ['Москва', 'Санкт-Петербург', 'Новосибирск']:
        City.objects.get_or_create(name=name)

    toyota, _ = CarMake.objects.get_or_create(name='Toyota')
    bmw, _ = CarMake.objects.get_or_create(name='BMW')

    for model_name in ['Camry', 'Corolla']:
        CarModel.objects.get_or_create(make=toyota, name=model_name)

    for model_name in ['3 Series', '5 Series']:
        CarModel.objects.get_or_create(make=bmw, name=model_name)


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_data, reverse_code=migrations.RunPython.noop),
    ]
