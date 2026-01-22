from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.permissions import RolePermission
from apps.core.mixins import ActivityLoggerMixin
from apps.services.models import Service, ServiceCategory
from apps.services.serializers import ServiceSerializer, ServiceCategorySerializer


class ServiceViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [RolePermission()]
    search_fields = ("title", "description")
    filterset_fields = ("category", "is_active")
    throttle_scope = "services"

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [RolePermission()]

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-activate")
    def bulk_activate(self, request):
        ids = request.data.get("ids", [])
        Service.objects.filter(id__in=ids).update(is_active=True)
        return Response({"detail": "تم تفعيل الخدمات"})

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-deactivate")
    def bulk_deactivate(self, request):
        ids = request.data.get("ids", [])
        Service.objects.filter(id__in=ids).update(is_active=False)
        return Response({"detail": "تم إيقاف الخدمات"})

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-delete")
    def bulk_delete(self, request):
        ids = request.data.get("ids", [])
        Service.objects.filter(id__in=ids).delete()
        return Response({"detail": "تم الحذف"})


class ServiceCategoryViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [RolePermission(allow_editors=False)]

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [RolePermission(allow_editors=False)]
