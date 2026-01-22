from __future__ import annotations

from celery import shared_task
from django.utils import timezone

from apps.portfolio.models import Project


@shared_task
def publish_scheduled_projects() -> int:
    """Mark scheduled projects as published/done when their time arrives."""
    now = timezone.now()
    qs = Project.objects.filter(scheduled_publish_at__isnull=False, scheduled_publish_at__lte=now).exclude(status="done")
    updated = 0
    for project in qs:
        project.status = "done"
        project.save(update_fields=["status"])
        updated += 1
    return updated
