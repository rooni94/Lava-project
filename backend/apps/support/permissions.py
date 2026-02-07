from rest_framework.permissions import BasePermission

from apps.accounts.models import User


class IsSupportAgent(BasePermission):
    """
    يسمح فقط للمديرين/السوبر أدمن (أو staff) بمتابعة محادثات الدعم.
    """

    def has_permission(self, request, view):
        user: User = request.user
        if not user or not user.is_authenticated:
            return False
        if getattr(user, "is_superuser", False) or getattr(user, "is_staff", False):
            return True
        return user.role in {User.Role.MANAGER, User.Role.SUPER_ADMIN}
