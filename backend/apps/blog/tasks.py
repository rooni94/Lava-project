from __future__ import annotations

from celery import shared_task
from django.utils import timezone

from apps.blog.models import BlogPost


@shared_task
def publish_scheduled_blog_posts() -> int:
    """Publish scheduled blog posts whose time has arrived."""
    now = timezone.now()
    count = 0
    qs = BlogPost.objects.filter(is_published=False, scheduled_publish_at__isnull=False, scheduled_publish_at__lte=now)
    for post in qs:
        post.is_published = True
        if not post.published_at:
            post.published_at = now
        post.save(update_fields=["is_published", "published_at"])
        count += 1
    return count
