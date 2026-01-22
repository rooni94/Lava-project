from __future__ import annotations

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimestampedModel


class Client(TimestampedModel):
    name = models.CharField(max_length=150, verbose_name=_("الاسم"))
    logo = models.ImageField(upload_to="clients/", blank=True, null=True)
    rating = models.PositiveSmallIntegerField(default=5)
    website = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)
    category = models.CharField(max_length=100, blank=True)
    contact_person = models.CharField(max_length=150, blank=True)

    class Meta:
        verbose_name = _("عميل")
        verbose_name_plural = _("العملاء")
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.name


class Testimonial(TimestampedModel):
    client = models.ForeignKey(Client, related_name="testimonials", on_delete=models.CASCADE)
    quote = models.TextField(verbose_name=_("التوصية"))
    author = models.CharField(max_length=150, blank=True)
    position = models.CharField(max_length=150, blank=True)
    rating = models.PositiveSmallIntegerField(default=5)
    is_featured = models.BooleanField(default=True)

    class Meta:
        verbose_name = _("توصية")
        verbose_name_plural = _("التوصيات")
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"{self.client.name} - توصية"
