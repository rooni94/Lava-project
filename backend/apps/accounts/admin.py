from __future__ import annotations

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("username", "email", "first_name", "last_name", "role", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_active", "is_superuser", "groups")
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("المعلومات الشخصية"), {"fields": ("first_name", "last_name", "email", "phone")}),
        (
            _("الصلاحيات"),
            {"fields": ("role", "is_active", "is_staff", "is_superuser", "groups", "user_permissions")},
        ),
        (_("تواريخ"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "email", "password1", "password2", "role", "is_staff", "is_active"),
            },
        ),
    )
    search_fields = ("username", "first_name", "last_name", "email")
    ordering = ("username",)
