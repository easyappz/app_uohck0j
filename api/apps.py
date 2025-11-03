from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"

    def ready(self):
        # Import signals on app ready
        try:
            from . import signals  # noqa: F401
        except Exception:
            # Avoid hard crash if migrations not yet applied
            pass
