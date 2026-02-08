from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.permissions import RolePermission
from apps.core.mixins import ActivityLoggerMixin
from apps.careers.models import JobApplication, JobOpening
from apps.careers.serializers import JobApplicationSerializer, JobOpeningSerializer
from apps.careers.utils import validate_resume_upload


class JobOpeningViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = JobOpening.objects.all()
    serializer_class = JobOpeningSerializer
    permission_classes = [RolePermission()]
    filterset_fields = ("is_active", "department", "employment_type")
    search_fields = ("title", "description", "department")
    throttle_scope = "jobs"

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [RolePermission()]

    def get_queryset(self):
        qs = super().get_queryset()
        request = getattr(self, "request", None)
        if not request or not request.user.is_authenticated:
            qs = qs.filter(is_active=True)
        return qs

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-close")
    def bulk_close(self, request):
        ids = request.data.get("ids", [])
        JobOpening.objects.filter(id__in=ids).update(is_active=False)
        return Response({"detail": "تم الإغلاق"})

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-publish")
    def bulk_publish(self, request):
        ids = request.data.get("ids", [])
        JobOpening.objects.filter(id__in=ids).update(is_active=True)
        return Response({"detail": "?? ????? ??????? ???????"})

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-delete")
    def bulk_delete(self, request):
        ids = request.data.get("ids", [])
        JobOpening.objects.filter(id__in=ids).delete()
        return Response({"detail": "?? ??? ??????? ???????"})



class JobApplicationViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = JobApplication.objects.select_related("job")
    serializer_class = JobApplicationSerializer
    permission_classes = [RolePermission()]
    filterset_fields = ("status", "job")
    search_fields = ("full_name", "email")
    throttle_scope = "contact"
    pagination_class = None

    def get_permissions(self):
        if self.action in ("create",):
            return [permissions.AllowAny()]
        return [RolePermission()]

    def perform_create(self, serializer):
        resume = self.request.FILES.get("resume")
        validate_resume_upload(resume)
        from apps.core.email_utils import detect_language

        language = self.request.data.get("language") or detect_language(self.request.data.get("cover_letter", ""))
        application = serializer.save(language=language, status=JobApplication.Status.NEW)
        try:
            from apps.core.email_utils import send_job_application_ack, send_job_application_notification

            send_job_application_notification(application)
            send_job_application_ack(application)
        except Exception:
            pass

    @action(detail=True, methods=["post"], permission_classes=[RolePermission()], url_path="reply")
    def reply(self, request, pk=None):
        application = self.get_object()
        subject = request.data.get("subject") or f"Re: {application.job.title}"
        body = request.data.get("body")
        if not body:
            return Response({"detail": "Body is required"}, status=400)
        from apps.core.email_utils import send_job_application_reply

        send_job_application_reply(application, subject=subject, body=body)
        if application.status == application.Status.NEW:
            application.status = application.Status.REVIEW
        application.save(update_fields=["status"])
        return Response({"detail": "تم إرسال الرد"})

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-status")
    def bulk_status(self, request):
        ids = request.data.get("ids", [])
        status_value = request.data.get("status")
        if status_value:
            JobApplication.objects.filter(id__in=ids).update(status=status_value)
        return Response({"detail": "تم التحديث"})
