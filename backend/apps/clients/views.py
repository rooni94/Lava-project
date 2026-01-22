from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.permissions import RolePermission
from apps.core.mixins import ActivityLoggerMixin
from apps.clients.models import Client, Testimonial
from apps.clients.serializers import ClientSerializer, TestimonialSerializer


class ClientViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [RolePermission()]
    filterset_fields = ("is_featured", "category")
    search_fields = ("name", "category")
    throttle_scope = "clients"

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [RolePermission()]

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-delete")
    def bulk_delete(self, request):
        ids = request.data.get("ids", [])
        Client.objects.filter(id__in=ids).delete()
        return Response({"detail": "تم حذف العملاء"})


class TestimonialViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = Testimonial.objects.select_related("client")
    serializer_class = TestimonialSerializer
    permission_classes = [RolePermission()]

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [RolePermission()]
