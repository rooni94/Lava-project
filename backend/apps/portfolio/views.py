from django.db.models import Count
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.permissions import RolePermission
from apps.core.mixins import ActivityLoggerMixin
from apps.portfolio.models import Project, ProjectImage, Technology
from apps.portfolio.serializers import ProjectImageSerializer, ProjectSerializer, TechnologySerializer


class ProjectViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = Project.objects.select_related().prefetch_related("technologies").all()
    serializer_class = ProjectSerializer
    permission_classes = [RolePermission()]
    filterset_fields = ("category", "status", "is_featured")
    search_fields = ("title", "description", "client")
    throttle_scope = "projects"

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [RolePermission()]

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny()], url_path="stats")
    def stats(self, request):
        total = Project.objects.count()
        featured = Project.objects.filter(is_featured=True).count()
        by_category = {item["category"]: item["count"] for item in Project.objects.values("category").annotate(count=Count("id"))}
        gallery_items = sum(len(p.gallery or []) for p in Project.objects.only("gallery"))
        media_items = ProjectImage.objects.count() + gallery_items
        tech_total = Technology.objects.count()
        return Response(
            {
                "total_projects": total,
                "featured_projects": featured,
                "by_category": by_category,
                "media_items": media_items,
                "technologies": tech_total,
            }
        )

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-publish")
    def bulk_publish(self, request):
        ids = request.data.get("ids", [])
        Project.objects.filter(id__in=ids).update(status="done")
        return Response({"detail": "تم نشر الأعمال المحددة"})

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-feature")
    def bulk_feature(self, request):
        ids = request.data.get("ids", [])
        Project.objects.filter(id__in=ids).update(is_featured=True)
        return Response({"detail": "تم تمييز الأعمال المحددة"})

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-delete")
    def bulk_delete(self, request):
        ids = request.data.get("ids", [])
        Project.objects.filter(id__in=ids).delete()
        return Response({"detail": "تم حذف الأعمال المحددة"})


class TechnologyViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer
    permission_classes = [RolePermission(allow_editors=False)]

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [RolePermission(allow_editors=False)]


class ProjectImageViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = ProjectImage.objects.select_related("project")
    serializer_class = ProjectImageSerializer
    permission_classes = [RolePermission()]

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [RolePermission()]
