from __future__ import annotations

import io
import mimetypes

from django.core.files.storage import default_storage
from django.utils import timezone
from PIL import Image
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.blog.models import BlogPost
from apps.careers.models import JobApplication, JobOpening
from apps.clients.models import Client
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
                        "actor": getattr(log.actor, "get_full_name", lambda: None)() or getattr(log.actor, "username", None),
                        "created_at": log.created_at,
                    }
                    for log in ActivityLog.objects.select_related("actor")[:5]
                ],
            }
        )


class FileUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs) -> Response:
        upload = request.FILES.get("file")
        if not upload:
            return Response({"detail": "لا يوجد ملف"}, status=status.HTTP_400_BAD_REQUEST)
        if upload.size > 5 * 1024 * 1024:
            return Response({"detail": "الملف أكبر من 5MB"}, status=status.HTTP_400_BAD_REQUEST)

        mime, _ = mimetypes.guess_type(upload.name)
        allowed = {"image/jpeg", "image/png", "image/webp", "application/pdf"}
        if mime not in allowed:
            return Response({"detail": "نوع الملف غير مسموح"}, status=status.HTTP_400_BAD_REQUEST)

        filename = upload.name
        content = upload
        if mime and mime.startswith("image/"):
            try:
                img = Image.open(upload)
                img.thumbnail((1600, 1600))
                buf = io.BytesIO()
                img.save(buf, format="WEBP", quality=85)
                buf.seek(0)
                content = buf
                filename = f"{timezone.now().strftime('%Y%m%d%H%M%S')}.webp"
            except Exception:
                return Response({"detail": "تعذر معالجة الصورة"}, status=status.HTTP_400_BAD_REQUEST)

        filename = default_storage.save(f"uploads/{timezone.now().strftime('%Y%m%d%H%M%S')}_{filename}", content)
        return Response({"path": default_storage.url(filename), "name": upload.name})
