from __future__ import annotations

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimestampedModel


class Technology(TimestampedModel):
    name = models.CharField(max_length=100, unique=True, verbose_name=_("التقنية"))
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name = _("تقنية")
        verbose_name_plural = _("التقنيات")
        ordering = ("name",)

    def __str__(self) -> str:
        return self.name


class Project(TimestampedModel):
    CATEGORY_CHOICES = [
        ("web", _("مواقع ويب")),
        ("mobile", _("تطبيقات جوال")),
        ("erp", _("أنظمة أعمال / ERP")),
        ("branding", _("هوية بصرية")),
        ("other", _("أخرى")),
    ]

    STATUS_CHOICES = [
        ("draft", _("مسودة")),
        ("in_progress", _("قيد التنفيذ")),
        ("done", _("منجز")),
    ]

    title = models.CharField(max_length=200, verbose_name=_("عنوان العمل"))
    description = models.TextField(verbose_name=_("الوصف المختصر"))
    summary = models.TextField(default="", blank=True, verbose_name=_("ملخص تنفيذي"))
    goals = models.TextField(default="", blank=True, verbose_name=_("الأهداف"))
    challenges = models.TextField(default="", blank=True, verbose_name=_("التحديات"))
    solution = models.TextField(default="", blank=True, verbose_name=_("الحل"))
    results = models.TextField(default="", blank=True, verbose_name=_("النتائج والأثر"))
    scope = models.CharField(max_length=150, default="", blank=True, verbose_name=_("نطاق العمل"))
    duration = models.CharField(max_length=100, default="", blank=True, verbose_name=_("المدة / الجدول الزمني"))
    team_size = models.CharField(max_length=100, default="", blank=True, verbose_name=_("حجم الفريق"))
    budget = models.CharField(max_length=100, default="", blank=True, verbose_name=_("الميزانية (اختياري)"))

    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="web", verbose_name=_("التصنيف"))
    client = models.CharField(max_length=150, blank=True, verbose_name=_("العميل"))
    technologies = models.ManyToManyField(Technology, related_name="projects", blank=True, verbose_name=_("التقنيات"))
    cover_image = models.ImageField(upload_to="projects/", blank=True, null=True, verbose_name=_("صورة الغلاف"))
    gallery = models.JSONField(default=list, blank=True, verbose_name=_("معرض الصور"))
    live_url = models.URLField(blank=True, verbose_name=_("رابط المشروع"))
    github_url = models.URLField(blank=True, verbose_name=_("رابط الكود"))
    is_featured = models.BooleanField(default=False, verbose_name=_("مميز في الواجهة"))
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="done", verbose_name=_("الحالة"))
    scheduled_publish_at = models.DateTimeField(blank=True, null=True, verbose_name=_("نشر مجدول في"))

    title_font_family = models.CharField(max_length=80, default="Cairo", verbose_name=_("خط العناوين"))
    body_font_family = models.CharField(max_length=80, default="Cairo", verbose_name=_("خط المحتوى"))
    title_font_size = models.PositiveSmallIntegerField(default=28, verbose_name=_("حجم خط العنوان"))
    body_font_size = models.PositiveSmallIntegerField(default=16, verbose_name=_("حجم خط النص"))
    primary_color = models.CharField(max_length=12, blank=True, verbose_name=_("لون أساسي"))
    accent_color = models.CharField(max_length=12, blank=True, verbose_name=_("لون مساعد"))

    class Meta:
        verbose_name = _("عمل")
        verbose_name_plural = _("الأعمال")
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.title


class ProjectImage(TimestampedModel):
    project = models.ForeignKey(Project, related_name="images", on_delete=models.CASCADE, verbose_name=_("العمل"))
    image = models.ImageField(upload_to="projects/gallery/", verbose_name=_("الصورة"))
    caption = models.CharField(max_length=200, blank=True, verbose_name=_("التسمية التوضيحية"))
    order = models.PositiveIntegerField(default=0, verbose_name=_("الترتيب"))

    class Meta:
        verbose_name = _("صورة عمل")
        verbose_name_plural = _("صور الأعمال")
        ordering = ("order",)

    def __str__(self) -> str:
        return f"{self.project.title} - صورة"
