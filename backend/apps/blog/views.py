from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.permissions import RolePermission
from apps.blog.models import BlogCategory, BlogComment, BlogPost
from apps.blog.serializers import BlogCategorySerializer, BlogCommentSerializer, BlogPostSerializer
from apps.core.mixins import ActivityLoggerMixin


class BlogCategoryViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    permission_classes = [RolePermission(allow_editors=False)]

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [RolePermission(allow_editors=False)]


class BlogPostViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = BlogPost.objects.select_related("category", "author").all()
    serializer_class = BlogPostSerializer
    permission_classes = [RolePermission()]
    lookup_field = "slug"
    filterset_fields = ("category", "is_published")
    search_fields = ("title", "content", "excerpt", "tags")
    throttle_scope = "blog"

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [RolePermission()]

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-publish")
    def bulk_publish(self, request):
        ids = request.data.get("ids", [])
        BlogPost.objects.filter(id__in=ids).update(is_published=True)
        return Response({"detail": "تم النشر"})

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-delete")
    def bulk_delete(self, request):
        ids = request.data.get("ids", [])
        BlogPost.objects.filter(id__in=ids).delete()
        return Response({"detail": "تم الحذف"})

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class BlogCommentViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = BlogComment.objects.select_related("post")
    serializer_class = BlogCommentSerializer
    filterset_fields = ("post", "is_approved")
    search_fields = ("name", "email", "content")
    throttle_scope = "blog"

    def get_queryset(self):
        qs = super().get_queryset()
        request = getattr(self, "request", None)
        if not request or not request.user.is_authenticated:
            qs = qs.filter(is_approved=True)
        return qs

    def get_permissions(self):
        if self.action in ("list", "retrieve", "create"):
            return [permissions.AllowAny()]
        return [RolePermission()]
