from __future__ import annotations

from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimestampedModel


class BlogCategory(TimestampedModel):
    name = models.CharField(max_length=100, verbose_name=_("اسم التصنيف"))
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name = _("تصنيف المدونة")
        verbose_name_plural = _("تصنيفات المدونة")
        ordering = ("name",)

    def __str__(self) -> str:
        return self.name


User = get_user_model()


class BlogPost(TimestampedModel):
    title = models.CharField(max_length=200, verbose_name=_("عنوان المقال"))
    slug = models.SlugField(unique=True)
    content = models.TextField(verbose_name=_("المحتوى"))
    excerpt = models.TextField(blank=True, verbose_name=_("نبذة مختصرة"))
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="posts")
    category = models.ForeignKey(BlogCategory, on_delete=models.SET_NULL, null=True, related_name="posts")
    tags = models.JSONField(default=list, blank=True)
    featured_image = models.ImageField(upload_to="blog/", blank=True, null=True)
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(blank=True, null=True)
    scheduled_publish_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        verbose_name = _("مقال")
        verbose_name_plural = _("المقالات")
        ordering = ("-published_at", "-created_at")

    def __str__(self) -> str:
        return self.title


class BlogComment(TimestampedModel):
    post = models.ForeignKey(
        BlogPost, related_name="comments", on_delete=models.CASCADE, verbose_name=_("المقال")
    )
    name = models.CharField(max_length=120, verbose_name=_("اسم المعلق"))
    email = models.EmailField(verbose_name=_("البريد الإلكتروني"))
    content = models.TextField(verbose_name=_("التعليق"))
    is_approved = models.BooleanField(default=True, verbose_name=_("مقبول للنشر"))

    class Meta:
        verbose_name = _("تعليق")
        verbose_name_plural = _("التعليقات")
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"{self.name} - {self.post.title}"
