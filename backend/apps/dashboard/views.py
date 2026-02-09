from __future__ import annotations

import mimetypes

from django.core.files.storage import default_storage
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.blog.models import BlogPost
from apps.careers.models import JobApplication, JobOpening
from apps.clients.models import Client
from apps.core.media_utils import iter_uploads, process_image_upload
from apps.core.models import ActivityLog, ContactMessage, SiteSettings, Subscriber
from apps.portfolio.models import Project
from apps.services.models import Service
from apps.team.models import TeamMember


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs) -> Response:
        return Response(
            {
                "services": Service.objects.count(),
                "projects": Project.objects.count(),
                "blog_posts": BlogPost.objects.count(),
                "team": TeamMember.objects.count(),
                "clients": Client.objects.count(),
                "messages": ContactMessage.objects.filter(is_handled=False).count(),
                "subscribers": Subscriber.objects.count(),
                "site_settings": SiteSettings.objects.count(),
                "jobs": JobOpening.objects.filter(is_active=True).count(),
                "applications": JobApplication.objects.count(),
                "recent_activity": [
                    {
                        "action": log.action,
                        "actor": getattr(log.actor, "get_full_name", lambda: None)()
                        or getattr(log.actor, "username", None),
                        "created_at": log.created_at,
                    }
                    for log in ActivityLog.objects.select_related("actor")[:5]
                ],
            }
        )


class FileUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs) -> Response:
        uploads = list(iter_uploads(request.FILES))
        if not uploads:
            return Response({"detail": "?? ???? ???"}, status=status.HTTP_400_BAD_REQUEST)

        results: list[dict[str, str]] = []
        for upload in uploads:
            if not upload:
                continue
            if upload.size > 5 * 1024 * 1024:
                return Response({"detail": "????? ???? ?? 5MB"}, status=status.HTTP_400_BAD_REQUEST)

            mime, _ = mimetypes.guess_type(upload.name)
            allowed = {"image/jpeg", "image/png", "image/webp", "application/pdf"}
            if mime not in allowed:
                return Response({"detail": "??? ????? ??? ?????"}, status=status.HTTP_400_BAD_REQUEST)

            filename = upload.name
            content = upload
            if mime and mime.startswith("image/"):
                try:
                    processed = process_image_upload(upload, watermark=True)
                    content = processed.content
                    filename = processed.filename
                except Exception:
                    return Response({"detail": "???? ?????? ??????"}, status=status.HTTP_400_BAD_REQUEST)

            saved = default_storage.save(
                f"uploads/{timezone.now().strftime('%Y%m%d%H%M%S')}_{filename}", content
            )
            results.append({"path": default_storage.url(saved), "name": upload.name})

        if request.FILES.get("file") and not request.FILES.getlist("files"):
            return Response(results[0])
        return Response({"items": results})
