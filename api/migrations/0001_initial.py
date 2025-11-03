from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # Dictionaries / References
        migrations.CreateModel(
            name='CarMake',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, unique=True)),
            ],
            options={'ordering': ['name']},
        ),
        migrations.CreateModel(
            name='BodyType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, unique=True)),
            ],
            options={'ordering': ['name']},
        ),
        migrations.CreateModel(
            name='FuelType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, unique=True)),
            ],
            options={'ordering': ['name']},
        ),
        migrations.CreateModel(
            name='TransmissionType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, unique=True)),
            ],
            options={'ordering': ['name']},
        ),
        migrations.CreateModel(
            name='DriveType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, unique=True)),
            ],
            options={'ordering': ['name']},
        ),
        migrations.CreateModel(
            name='Color',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, unique=True)),
            ],
            options={'ordering': ['name']},
        ),
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, unique=True)),
            ],
            options={'ordering': ['name']},
        ),
        migrations.CreateModel(
            name='Feature',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, unique=True)),
            ],
            options={'ordering': ['name']},
        ),
        migrations.CreateModel(
            name='CarModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('make', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='car_models', to='api.carmake')),
            ],
            options={'ordering': ['make__name', 'name']},
        ),

        # Profiles
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('user', 'User'), ('moderator', 'Moderator'), ('admin', 'Admin')], default='user', max_length=16)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),

        # Ads
        migrations.CreateModel(
            name='CarAd',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True)),
                ('price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('year', models.PositiveIntegerField()),
                ('mileage', models.PositiveIntegerField(help_text='Mileage in km')),
                ('engine_volume', models.DecimalField(decimal_places=1, help_text='Liters, e.g. 2.0', max_digits=4)),
                ('power', models.PositiveIntegerField(help_text='HP')),
                ('vin', models.CharField(blank=True, max_length=32, null=True)),
                ('condition', models.CharField(choices=[('new', 'New'), ('used', 'Used')], default='used', max_length=8)),
                ('is_active', models.BooleanField(default=True)),
                ('body_type', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='ads', to='api.bodytype')),
                ('city', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='ads', to='api.city')),
                ('color', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='ads', to='api.color')),
                ('drive_type', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='ads', to='api.drivetype')),
                ('fuel_type', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='ads', to='api.fueltype')),
                ('make', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='ads', to='api.carmake')),
                ('model', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='ads', to='api.carmodel')),
                ('seller', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='car_ads', to=settings.AUTH_USER_MODEL)),
                ('transmission_type', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='ads', to='api.transmissiontype')),
            ],
            options={'ordering': ['-created_at']},
        ),
        migrations.AddField(
            model_name='carad',
            name='features',
            field=models.ManyToManyField(blank=True, related_name='ads', to='api.feature'),
        ),
        migrations.AddField(
            model_name='carad',
            name='drive_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='ads', to='api.drivetype'),
        ),

        migrations.CreateModel(
            name='CarImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='ads/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('ad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='api.carad')),
            ],
        ),

        migrations.CreateModel(
            name='Favorite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('ad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorited_by', to='api.carad')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorites', to=settings.AUTH_USER_MODEL)),
            ],
        ),

        migrations.CreateModel(
            name='ContactRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('phone', models.CharField(max_length=32)),
                ('message', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('ad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contact_requests', to='api.carad')),
                ('buyer', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='contact_requests', to=settings.AUTH_USER_MODEL)),
            ],
            options={'ordering': ['-created_at']},
        ),

        # Constraints and indexes
        migrations.AlterUniqueTogether(
            name='carmodel',
            unique_together={('make', 'name')},
        ),
        migrations.AlterUniqueTogether(
            name='favorite',
            unique_together={('user', 'ad')},
        ),
        migrations.AddIndex(
            model_name='carad',
            index=models.Index(fields=['is_active', 'created_at'], name='api_carad_active_created_idx'),
        ),
        migrations.AddIndex(
            model_name='carad',
            index=models.Index(fields=['price'], name='api_carad_price_idx'),
        ),
        migrations.AddIndex(
            model_name='carad',
            index=models.Index(fields=['year'], name='api_carad_year_idx'),
        ),
    ]
