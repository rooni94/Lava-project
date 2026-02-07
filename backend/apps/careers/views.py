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

    def get_permissions(self):
        if self.action in ("create",):
            return [permissions.AllowAny()]
        return [RolePermission()]

    def perform_create(self, serializer):
        resume = self.request.FILES.get("resume")
        validate_resume_upload(resume)
        application = serializer.save()
        try:
            from apps.core.email_utils import send_job_application_notification

            send_job_application_notification(application)
        except Exception:
            pass

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-status")
    def bulk_status(self, request):
        ids = request.data.get("ids", [])
        status_value = request.data.get("status")
        if status_value:
            JobApplication.objects.filter(id__in=ids).update(status=status_value)
        return Response({"detail": "تم التحديث"})
