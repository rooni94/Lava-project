from __future__ import annotations

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimestampedModel


class TeamMember(TimestampedModel):
    name = models.CharField(max_length=120, verbose_name=_("الاسم"))
    position = models.CharField(max_length=150, verbose_name=_("المسمى الوظيفي"))
    bio = models.TextField(blank=True, verbose_name=_("نبذة"))
    image = models.ImageField(upload_to="team/", blank=True, null=True)
    social_links = models.JSONField(default=dict, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = _("عضو الفريق")
        verbose_name_plural = _("الفريق")
        ordering = ("order",)

    def __str__(self) -> str:
        return self.name
