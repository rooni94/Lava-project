from rest_framework import permissions, viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

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

    def get_queryset(self):
        qs = super().get_queryset()
        request = getattr(self, "request", None)
        if not request or not request.user.is_authenticated:
            qs = qs.filter(is_active=True)
        return qs

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-activate")
    def bulk_activate(self, request):
        ids = request.data.get("ids", [])
        Package.objects.filter(id__in=ids).update(is_active=True)
        return Response({"detail": "Activated"})

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-deactivate")
    def bulk_deactivate(self, request):
        ids = request.data.get("ids", [])
        Package.objects.filter(id__in=ids).update(is_active=False)
        return Response({"detail": "Deactivated"})

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-delete")
    def bulk_delete(self, request):
        ids = request.data.get("ids", [])
        Package.objects.filter(id__in=ids).delete()
        return Response({"detail": "Deleted"})

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-show-prices")
    def bulk_show_prices(self, request):
        ids = request.data.get("ids", [])
        Package.objects.filter(id__in=ids).update(show_price=True)
        return Response({"detail": "Prices shown for selected packages"})

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-hide-prices")
    def bulk_hide_prices(self, request):
        ids = request.data.get("ids", [])
        Package.objects.filter(id__in=ids).update(show_price=False)
        return Response({"detail": "Prices hidden for selected packages"})

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-hide-all-prices")
    def bulk_hide_all_prices(self, request):
        Package.objects.update(show_price=False)
        return Response({"detail": "Prices hidden for all packages"})

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-show-all-prices")
    def bulk_show_all_prices(self, request):
        Package.objects.update(show_price=True)
        return Response({"detail": "Prices shown for all packages"})
