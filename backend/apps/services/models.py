from __future__ import annotations

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimestampedModel


class ServiceCategory(TimestampedModel):
    name = models.CharField(max_length=120, verbose_name=_("الفئة"))
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, verbose_name=_("الوصف"))
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = _("فئة خدمة")
        verbose_name_plural = _("فئات الخدمات")
        ordering = ("order", "name")

    def __str__(self) -> str:
        return self.name


class Service(TimestampedModel):
    title = models.CharField(max_length=150, verbose_name=_("العنوان"))
    description = models.TextField(verbose_name=_("الوصف"))
    icon = models.CharField(max_length=100, blank=True, verbose_name=_("الأيقونة"))
    image = models.ImageField(upload_to="services/", blank=True, null=True)
    features = models.JSONField(default=list, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    category = models.ForeignKey(
        ServiceCategory, related_name="services", on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        verbose_name = _("خدمة")
        verbose_name_plural = _("الخدمات")
        ordering = ("order",)

    def __str__(self) -> str:
        return self.title
