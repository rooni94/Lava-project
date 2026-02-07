from urllib.parse import parse_qs

from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken


class JwtAuthMiddleware:
    """
    يقرأ ?token=... من query string ويحوّلها إلى user في scope["user"].
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        qs = parse_qs(query_string)

        scope["user"] = AnonymousUser()
        scope["is_guest"] = "guest" in qs

        token_list = qs.get("token")
        if token_list:
            token = token_list[0]
            try:
                access = AccessToken(token)
                user_id = access["user_id"]
                User = get_user_model()
                user = await database_sync_to_async(User.objects.get)(id=user_id)
                scope["user"] = user
            except Exception:
                pass

        return await self.inner(scope, receive, send)


def JwtAuthMiddlewareStack(inner):
    return JwtAuthMiddleware(AuthMiddlewareStack(inner))
