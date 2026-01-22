from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.models import User
from apps.accounts.serializers import (
    PasswordChangeSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    UserSerializer,
)
from apps.accounts.permissions import RolePermission
from apps.core.mixins import ActivityLoggerMixin


class UserViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [RolePermission(allow_editors=False)]
    search_fields = ("username", "email", "first_name", "last_name")
    ordering_fields = ("date_joined", "username")

    def get_permissions(self):
        if self.action in ("me",):
            return [permissions.IsAuthenticated()]
        return [RolePermission(allow_editors=False)]

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def change_password(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "تم تحديث كلمة المرور"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], permission_classes=[permissions.AllowAny])
    def reset_password_request(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(email=serializer.validated_data["email"])
        token = PasswordResetTokenGenerator().make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f"{request.build_absolute_uri('/reset-password/confirm')}?uid={uidb64}&token={token}"
        send_mail(
            subject="إعادة تعيين كلمة المرور",
            message=f"استخدم الرابط التالي لإعادة التعيين: {reset_link}",
            from_email=None,
            recipient_list=[user.email],
        )
        return Response({"detail": "تم إرسال تعليمات إعادة التعيين"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], permission_classes=[permissions.AllowAny])
    def reset_password_confirm(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "تم تعيين كلمة المرور الجديدة"}, status=status.HTTP_200_OK)
