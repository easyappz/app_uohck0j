from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdOwnerOrModerator(BasePermission):
    message = "You do not have permission to modify this ad."

    def has_object_permission(self, request, view, obj) -> bool:
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if getattr(obj, "seller_id", None) == getattr(user, "id", None):
            return True
        role = getattr(getattr(user, "profile", None), "role", "user")
        if role in ("moderator", "admin") or user.is_staff or user.is_superuser:
            return True
        return False
