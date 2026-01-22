from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.permissions import RolePermission
from apps.core.mixins import ActivityLoggerMixin
from apps.team.models import TeamMember
from apps.team.serializers import TeamMemberSerializer


class TeamMemberViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    throttle_scope = "team"

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [RolePermission()]

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-delete")
    def bulk_delete(self, request):
        ids = request.data.get("ids", [])
        TeamMember.objects.filter(id__in=ids).delete()
        return Response({"detail": "تم حذف الأعضاء المحددين"})
