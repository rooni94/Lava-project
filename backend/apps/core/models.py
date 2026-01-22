from __future__ import annotations

from typing import Any

from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ("-created_at",)


class SiteSettings(TimestampedModel):
    site_name = models.CharField(max_length=150, verbose_name=_("اسم الموقع"))
    tagline = models.CharField(max_length=255, blank=True, verbose_name=_("سطر الوصف"))
    primary_color = models.CharField(max_length=20, default="#580213")
    secondary_color = models.CharField(max_length=20, default="#222222")
    accent_color = models.CharField(max_length=20, default="#CCCCCC")
    address = models.CharField(max_length=255, blank=True, verbose_name=_("العنوان"))
    phone = models.CharField(max_length=50, blank=True, verbose_name=_("الهاتف"))
    email = models.EmailField(blank=True, verbose_name=_("البريد الإلكتروني"))
    hero_title = models.CharField(max_length=200, blank=True, verbose_name=_("عنوان البطل"))
    hero_subtitle = models.TextField(blank=True, verbose_name=_("وصف البطل"))
    hero_background = models.ImageField(upload_to="hero/", blank=True, null=True)
    logo = models.ImageField(upload_to="branding/", blank=True, null=True)
    favicon = models.ImageField(upload_to="branding/", blank=True, null=True)
    social_links = models.JSONField(default=dict, blank=True)
    seo_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.JSONField(default=list, blank=True)
    og_image = models.ImageField(upload_to="branding/", blank=True, null=True)
    analytics_codes = models.JSONField(default=dict, blank=True)
    email_templates = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = _("إعدادات الموقع")
        verbose_name_plural = _("إعدادات الموقع")

    def __str__(self) -> str:
        return self.site_name


class Page(TimestampedModel):
    STATUS_CHOICES = [("draft", _("مسودة")), ("published", _("منشورة"))]

    name = models.CharField(max_length=100, verbose_name=_("الاسم"))
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200, verbose_name=_("العنوان"))
    meta_description = models.TextField(blank=True, verbose_name=_("وصف ميتا"))
    hero_image = models.ImageField(upload_to="pages/", blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="published")

    class Meta:
        verbose_name = _("صفحة")
        verbose_name_plural = _("الصفحات")
        ordering = ("name",)

    def __str__(self) -> str:
        return self.name


class Section(TimestampedModel):
    page = models.ForeignKey(Page, related_name="sections", on_delete=models.CASCADE)
    title = models.CharField(max_length=200, verbose_name=_("العنوان"))
    content = models.TextField(verbose_name=_("المحتوى"))
    section_type = models.CharField(max_length=100, blank=True)
    order = models.PositiveIntegerField(default=0)
    media = models.ImageField(upload_to="sections/", blank=True, null=True)
    extra = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = _("قسم")
        verbose_name_plural = _("الأقسام")
        ordering = ("order",)

    def __str__(self) -> str:
        return f"{self.page.name} - {self.title}"


class ContactInfo(TimestampedModel):
    location = models.CharField(max_length=255, blank=True, verbose_name=_("الموقع"))
    phone = models.CharField(max_length=50, blank=True, verbose_name=_("الهاتف"))
    email = models.EmailField(blank=True, verbose_name=_("البريد الإلكتروني"))
    map_embed = models.TextField(blank=True, verbose_name=_("خريطة"))
    working_hours = models.CharField(max_length=150, blank=True, verbose_name=_("ساعات العمل"))

    class Meta:
        verbose_name = _("معلومات التواصل")
        verbose_name_plural = _("معلومات التواصل")

    def __str__(self) -> str:
        return self.location or _("معلومات التواصل")


class ContactMessage(TimestampedModel):
    SERVICE_CHOICES = [
        ("web", _("Web development")),
        ("mobile", _("Mobile apps")),
        ("erp", _("ERP/CRM")),
        ("other", _("Other")),
    ]

    name = models.CharField(max_length=120, verbose_name=_("Name"))
    email = models.EmailField(verbose_name=_("Email"))
    phone = models.CharField(max_length=50, blank=True, verbose_name=_("Phone"))
    message = models.TextField(verbose_name=_("Message"))
    service_type = models.CharField(max_length=50, choices=SERVICE_CHOICES, default="other")
    status = models.CharField(
        max_length=20,
        choices=[("new", _("New")), ("replied", _("Replied")), ("resolved", _("Closed"))],
        default="new",
    )
    is_handled = models.BooleanField(default=False, verbose_name=_("Handled"))

    class Meta:
        verbose_name = _("Contact message")
        verbose_name_plural = _("Contact messages")
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"{self.name} - {self.get_service_type_display()}"


class Subscriber(TimestampedModel):
    email = models.EmailField(unique=True, verbose_name=_("البريد الإلكتروني"))
    source = models.CharField(max_length=100, blank=True)
    tags = models.JSONField(default=list, blank=True)

    class Meta:
        verbose_name = _("مشترك")
        verbose_name_plural = _("المشتركين")
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.email


User = get_user_model()


class ActivityLog(TimestampedModel):
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="activities")
    action = models.CharField(max_length=150)
    metadata: Any = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = _("سجل النشاط")
        verbose_name_plural = _("سجل النشاط")

    def __str__(self) -> str:
        return f"{self.actor} - {self.action}"


class MediaFile(TimestampedModel):
    class MediaType(models.TextChoices):
        IMAGE = "image", _("صورة")
        DOCUMENT = "document", _("ملف")
        VIDEO = "video", _("فيديو")

    file = models.FileField(upload_to="media-library/")
    media_type = models.CharField(max_length=20, choices=MediaType.choices, default=MediaType.IMAGE)
    title = models.CharField(max_length=200, blank=True)
    alt_text = models.CharField(max_length=200, blank=True)
    category = models.CharField(max_length=100, blank=True)

    class Meta:
        verbose_name = _("وسائط")
        verbose_name_plural = _("مكتبة الوسائط")

    def __str__(self) -> str:
        return self.title or self.file.name
