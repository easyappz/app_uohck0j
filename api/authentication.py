from typing import Optional, Tuple

from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed

from .utils.jwt import decode_jwt

User = get_user_model()


class JWTAuthentication(BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request) -> Optional[Tuple[User, None]]:
        auth = get_authorization_header(request).decode("utf-8")
        if not auth:
            return None
        parts = auth.split()
        if len(parts) != 2 or parts[0] != self.keyword:
            return None
        token = parts[1]
        try:
            payload = decode_jwt(token)
        except ValueError as e:
            raise AuthenticationFailed("Invalid token") from e
        if payload.get("type") != "access":
            raise AuthenticationFailed("Invalid token type")
        user_id = payload.get("sub")
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist as e:
            raise AuthenticationFailed("User not found") from e
        return (user, None)

    def authenticate_header(self, request) -> str:
        return self.keyword
