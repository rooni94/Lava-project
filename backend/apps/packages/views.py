from rest_framework import permissions, viewsets, filters

from apps.accounts.permissions import RolePermission
from apps.core.mixins import ActivityLoggerMixin
from apps.packages.models import Package, PackageCategory
from apps.packages.serializers import PackageCategorySerializer, PackageSerializer


class PackageCategoryViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = PackageCategory.objects.all()
    serializer_class = PackageCategorySerializer
    permission_classes = [RolePermission(allow_editors=False)]
    search_fields = ("name_ar", "name_en")

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [RolePermission(allow_editors=False)]


class PackageViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = Package.objects.select_related("category").all()
    serializer_class = PackageSerializer
    permission_classes = [RolePermission()]
    filterset_fields = ("category", "featured", "is_active", "product_type")
    search_fields = ("title_ar", "title_en", "short_description_ar", "short_description_en")
    ordering_fields = ("created_at", "featured", "price")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    throttle_scope = "packages"

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [RolePermission()]
