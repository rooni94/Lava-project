from __future__ import annotations

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimestampedModel


class PackageCategory(TimestampedModel):
    name_ar = models.CharField(max_length=150, verbose_name=_("Ø§Ø³Ù… Ø§Ù„ÙØ¦Ø© (Ø¹Ø±Ø¨ÙŠ)"))
    name_en = models.CharField(max_length=150, verbose_name=_("Category name (EN)"))
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name = _("ÙØ¦Ø© Ø¨Ø§Ù‚Ø§Øª")
        verbose_name_plural = _("ÙØ¦Ø§Øª Ø§Ù„Ø¨Ø§Ù‚Ø§Øª")
        ordering = ("name_ar",)

    def __str__(self) -> str:
        return self.name_ar or self.name_en


class Package(TimestampedModel):
    PRODUCT_TYPES = [
        ("service", _("Ø®Ø¯Ù…Ø©")),
        ("bundle", _("Ø¨Ø§Ù‚Ø©")),
    ]

    slug = models.SlugField(unique=True)
    title_ar = models.CharField(max_length=200, verbose_name=_("Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©"))
    title_en = models.CharField(max_length=200, verbose_name=_("Title (EN)"))
    short_description_ar = models.CharField(max_length=255, blank=True, verbose_name=_("ÙˆØµÙ Ù‚ØµÙŠØ± (Ø¹Ø±Ø¨ÙŠ)"))
    short_description_en = models.CharField(max_length=255, blank=True, verbose_name=_("Short description (EN)"))
    description_ar = models.TextField(blank=True, verbose_name=_("Ø§Ù„Ù…Ø²Ø§ÙŠØ§ / Ø§Ù„Ù…Ø­ØªÙˆÙ‰ (Ø¹Ø±Ø¨ÙŠ)"))
    description_en = models.TextField(blank=True, verbose_name=_("Features / content (EN)"))
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name=_("Ø§Ù„Ø³Ø¹Ø±"))
    price_note = models.CharField(max_length=120, blank=True, verbose_name=_("Ù…Ù„Ø§Ø­Ø¸Ø© Ø§Ù„Ø³Ø¹Ø±"))
    price_note_en = models.CharField(max_length=120, blank=True, verbose_name=_("Price note (EN)"))
    currency = models.CharField(max_length=10, default="SAR", verbose_name=_("Ø§Ù„Ø¹Ù…Ù„Ø©"))
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES, default="service")
    category = models.ForeignKey(
        PackageCategory, related_name="packages", on_delete=models.SET_NULL, null=True, blank=True, verbose_name=_("Ø§Ù„ØªØµÙ†ÙŠÙ")
    )
    featured = models.BooleanField(default=False, verbose_name=_("Ù…Ù…ÙŠØ²"))
    is_active = models.BooleanField(default=True, verbose_name=_("ÙØ¹Ø§Ù„"))

    class Meta:
        verbose_name = _("Ø¨Ø§Ù‚Ø©")
        verbose_name_plural = _("Ø§Ù„Ø¨Ø§Ù‚Ø§Øª")
        ordering = ("-featured", "-created_at")

    def __str__(self) -> str:
        return self.title_ar or self.title_en
