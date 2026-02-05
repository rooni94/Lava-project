from rest_framework.permissions import BasePermission, SAFE_METHODS
from apps.accounts.models import User


class RolePermission(BasePermission):
    """
    Enforces role-based access for write operations.
    - Super Admin: full access
    - Manager: can write
    - Editor: can write if allow_editors=True
    - Viewer: read-only
    """

    def __init__(self, allow_editors: bool = True):
        self.allow_editors = allow_editors

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user: User = request.user
        if not user or not user.is_authenticated:
            return False
        # Superuser/staff always allowed for write operations
        if getattr(user, "is_superuser", False) or getattr(user, "is_staff", False):
            return True
        if user.role == User.Role.SUPER_ADMIN:
            return True
        if user.role == User.Role.MANAGER:
            return True
        if self.allow_editors and user.role == User.Role.EDITOR:
            return True
        return False
