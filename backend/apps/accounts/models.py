from __future__ import annotations

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = "super_admin", _("مشرف عام")
        MANAGER = "manager", _("مدير")
        EDITOR = "editor", _("محرر")
        VIEWER = "viewer", _("مشاهد")

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.VIEWER)
    phone = models.CharField(max_length=50, blank=True, verbose_name=_("رقم الهاتف"))

    class Meta:
        verbose_name = _("مستخدم")
        verbose_name_plural = _("المستخدمون")

    @property
    def is_manager(self) -> bool:
        return self.role in {self.Role.MANAGER, self.Role.SUPER_ADMIN}

    @property
    def is_editor(self) -> bool:
        return self.role in {self.Role.EDITOR, self.Role.MANAGER, self.Role.SUPER_ADMIN}
