from __future__ import annotations

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimestampedModel


class PackageCategory(TimestampedModel):
    name_ar = models.CharField(max_length=150, verbose_name=_("اسم الفئة (عربي)"))
    name_en = models.CharField(max_length=150, verbose_name=_("Category name (EN)"))
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name = _("فئة باقات")
        verbose_name_plural = _("فئات الباقات")
        ordering = ("name_ar",)

    def __str__(self) -> str:
        return self.name_ar or self.name_en


class Package(TimestampedModel):
    PRODUCT_TYPES = [
        ("service", _("خدمة")),
        ("bundle", _("باقة")),
    ]

    slug = models.SlugField(unique=True)
    title_ar = models.CharField(max_length=200, verbose_name=_("العنوان بالعربية"))
    title_en = models.CharField(max_length=200, verbose_name=_("Title (EN)"))
    short_description_ar = models.CharField(max_length=255, blank=True, verbose_name=_("وصف قصير (عربي)"))
    short_description_en = models.CharField(max_length=255, blank=True, verbose_name=_("Short description (EN)"))
    description_ar = models.TextField(blank=True, verbose_name=_("المزايا / المحتوى (عربي)"))
    description_en = models.TextField(blank=True, verbose_name=_("Features / content (EN)"))
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name=_("السعر"))
    price_note = models.CharField(max_length=120, blank=True, verbose_name=_("ملاحظة السعر"))
    price_note_en = models.CharField(max_length=120, blank=True, verbose_name=_("Price note (EN)"))
    currency = models.CharField(max_length=10, default="SAR", verbose_name=_("العملة"))
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES, default="service")
    category = models.ForeignKey(
        PackageCategory,
        related_name="packages",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("التصنيف"),
    )
    featured = models.BooleanField(default=False, verbose_name=_("مميز"))
    is_active = models.BooleanField(default=True, verbose_name=_("فعال"))
    show_price = models.BooleanField(default=True, verbose_name=_("إظهار السعر"))

    class Meta:
        verbose_name = _("باقة")
        verbose_name_plural = _("الباقات")
        ordering = ("-featured", "-created_at")

    def __str__(self) -> str:
        return self.title_ar or self.title_en
