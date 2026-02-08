from __future__ import annotations

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimestampedModel


class JobOpening(TimestampedModel):
    title = models.CharField(max_length=200, verbose_name=_("المسمى الوظيفي"))
    department = models.CharField(max_length=150, blank=True)
    location = models.CharField(max_length=150, blank=True)
    employment_type = models.CharField(
        max_length=50,
        choices=[("full_time", "دوام كامل"), ("part_time", "دوام جزئي"), ("contract", "متعاقد"), ("intern", "تدريب")],
        default="full_time",
    )
    description = models.TextField(verbose_name=_("الوصف"))
    requirements = models.JSONField(default=list, blank=True)
    benefits = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    apply_url = models.URLField(blank=True)

    class Meta:
        verbose_name = _("وظيفة")
        verbose_name_plural = _("الوظائف")
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.title


class JobApplication(TimestampedModel):
    class Status(models.TextChoices):
        NEW = "new", _("جديد")
        REVIEW = "review", _("قيد المراجعة")
        INTERVIEW = "interview", _("مقابلة")
        HIRED = "hired", _("تم التعيين")
        REJECTED = "rejected", _("مرفوض")

    job = models.ForeignKey(JobOpening, related_name="applications", on_delete=models.CASCADE)
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    resume = models.FileField(upload_to="careers/resumes/")
    cover_letter = models.TextField(blank=True)
    language = models.CharField(max_length=5, default="ar")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = _("طلب توظيف")
        verbose_name_plural = _("طلبات التوظيف")
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"{self.full_name} - {self.job.title}"
