from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    RefreshView,
    MeView,
    AdsListCreateView,
    AdDetailView,
    AdImagesUploadView,
    FavoriteToggleView,
    FavoritesListView,
    ContactRequestCreateView,
    MetaOptionsView,
    MetaModelsByMakeView,
)

urlpatterns = [
    # Auth
    path("auth/register", RegisterView.as_view(), name="auth-register"),
    path("auth/login", LoginView.as_view(), name="auth-login"),
    path("auth/refresh", RefreshView.as_view(), name="auth-refresh"),
    path("auth/me", MeView.as_view(), name="auth-me"),

    # Ads CRUD
    path("ads", AdsListCreateView.as_view(), name="ads-list-create"),
    path("ads/<int:pk>", AdDetailView.as_view(), name="ads-detail"),
    path("ads/<int:id>/images", AdImagesUploadView.as_view(), name="ads-images"),

    # Favorites
    path("ads/<int:id>/favorite", FavoriteToggleView.as_view(), name="ads-favorite-toggle"),
    path("favorites", FavoritesListView.as_view(), name="favorites-list"),

    # Contact
    path("ads/<int:id}/contact", ContactRequestCreateView.as_view(), name="ads-contact"),

    # Meta
    path("meta/options", MetaOptionsView.as_view(), name="meta-options"),
    path("meta/models", MetaModelsByMakeView.as_view(), name="meta-models"),
]
