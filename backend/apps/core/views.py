from __future__ import annotations

import csv

from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import RolePermission
from apps.core.mixins import ActivityLoggerMixin
from apps.core.models import ActivityLog, ContactInfo, ContactMessage, MediaFile, Page, Section, SiteSettings, Subscriber
from apps.core.serializers import (
    ActivityLogSerializer,
    ContactInfoSerializer,
    ContactMessageSerializer,
    MediaFileSerializer,
    PageSerializer,
    SectionSerializer,
    SiteSettingsSerializer,
    SubscriberSerializer,
    UserRegistrationSerializer,
)


class PublicReadMixin:
    """Allow unauthenticated reads while keeping write actions protected."""

    def _get_configured_permissions(self):
        perms = []
        for perm in getattr(self, "permission_classes", []):
            perms.append(perm() if isinstance(perm, type) else perm)
        return perms

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        configured = self._get_configured_permissions()
        return configured or [permissions.IsAuthenticated()]


class SiteSettingsViewSet(ActivityLoggerMixin, PublicReadMixin, viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [RolePermission(allow_editors=False)]


class PageViewSet(ActivityLoggerMixin, PublicReadMixin, viewsets.ModelViewSet):
    queryset = Page.objects.prefetch_related("sections").all()
    serializer_class = PageSerializer
    lookup_field = "slug"
    filterset_fields = ("status",)
    search_fields = ("name", "title", "slug")

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs.get(lookup_url_kwarg)
        if lookup_value and str(lookup_value).isdigit():
            obj = queryset.filter(id=int(lookup_value)).first()
            if obj:
                self.check_object_permissions(self.request, obj)
                return obj
        return get_object_or_404(queryset, **{self.lookup_field: lookup_value})

    def get_queryset(self):
        qs = super().get_queryset()
        request = getattr(self, "request", None)
        if not request or not request.user.is_authenticated:
            qs = qs.filter(status="published")
        return qs


class SectionViewSet(ActivityLoggerMixin, PublicReadMixin, viewsets.ModelViewSet):
    queryset = Section.objects.select_related("page").all()
    serializer_class = SectionSerializer
    filterset_fields = ("page", "section_type")
    pagination_class = None  # return جميع الأقسام دون صفحات حتى لا تُعاد 404 عند تجاوز الصفحة

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-delete")
    def bulk_delete(self, request):
        ids = request.data.get("ids", [])
        Section.objects.filter(id__in=ids).delete()
        return Response({"detail": "تم حذف الأقسام"})

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="reorder")
    def reorder(self, request):
        orders = request.data.get("orders", [])
        for item in orders:
            Section.objects.filter(id=item.get("id")).update(order=item.get("order", 0))
        return Response({"detail": "تم تحديث الترتيب"})


class ContactInfoViewSet(ActivityLoggerMixin, PublicReadMixin, viewsets.ModelViewSet):
    queryset = ContactInfo.objects.all()
    serializer_class = ContactInfoSerializer


class ContactMessageViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    filterset_fields = ("service_type", "status", "topic")
    search_fields = ("name", "email", "message")
    throttle_scope = "contact"
    pagination_class = None

    def get_permissions(self):
        if self.action in ("create",):
            return [permissions.AllowAny()]
        return [RolePermission()]

    @action(detail=True, methods=["post"], permission_classes=[RolePermission()], url_path="reply")
    def reply(self, request, pk=None):
        message = self.get_object()
        subject = request.data.get("subject") or f"Re: {message.name}"
        body = request.data.get("body")
        if not body:
            return Response({"detail": "Body is required"}, status=400)
        from apps.core.email_utils import send_contact_reply

        send_contact_reply(message, subject=subject, body=body)
        message.status = "replied"
        message.is_handled = True
        message.save(update_fields=["status", "is_handled"])
        return Response({"detail": "تم إرسال الرد"})


class SubscriberViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer
    filterset_fields = ("source",)

    def get_permissions(self):
        if self.action in ("create",):
            return [permissions.AllowAny()]
        return [RolePermission()]


class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.select_related("actor").all()
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]


class MediaFileViewSet(ActivityLoggerMixin, viewsets.ModelViewSet):
    queryset = MediaFile.objects.all()
    serializer_class = MediaFileSerializer
    permission_classes = [RolePermission()]
    filterset_fields = ("media_type", "category")
    throttle_scope = "media"

    def get_permissions(self):
        return [RolePermission()]

    @action(detail=False, methods=["post"], permission_classes=[RolePermission()], url_path="bulk-delete")
    def bulk_delete(self, request):
        ids = request.data.get("ids", [])
        MediaFile.objects.filter(id__in=ids).delete()
        return Response({"detail": "تم حذف الوسائط"})


class ExportSubscribersView(APIView):
    permission_classes = [RolePermission(allow_editors=False)]

    def get(self, request, *args, **kwargs):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="subscribers.csv"'
        writer = csv.writer(response)
        writer.writerow(["email", "source", "tags", "created_at"])
        for sub in Subscriber.objects.all():
            writer.writerow([sub.email, sub.source, ";".join(sub.tags or []), sub.created_at])
        return response


class ExportMessagesView(APIView):
    permission_classes = [RolePermission(allow_editors=False)]

    def get(self, request, *args, **kwargs):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="contact_messages.csv"'
        writer = csv.writer(response)
        writer.writerow(["name", "email", "service_type", "topic", "language", "status", "message", "created_at"])
        for msg in ContactMessage.objects.all():
            writer.writerow([msg.name, msg.email, msg.service_type, msg.topic, msg.language, msg.status, msg.message, msg.created_at])
        return response


User = get_user_model()


class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs) -> Response:
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ContactSubmitView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = "contact"

    def post(self, request, *args, **kwargs):
        payload = request.data.copy()
        if not payload.get("topic"):
            payload["topic"] = "sales"
        if not payload.get("language"):
            from apps.core.email_utils import detect_language

            payload["language"] = detect_language(payload.get("message", ""))
        payload["status"] = "new"
        payload["is_handled"] = False
        serializer = ContactMessageSerializer(data=payload)
        serializer.is_valid(raise_exception=True)
        message = serializer.save()
        try:
            from apps.core.email_utils import send_contact_ack, send_contact_notification

            topic = request.data.get("topic") or request.data.get("category") or message.topic
            send_contact_notification(message, topic=topic)
            send_contact_ack(message)
        except Exception:
            # Avoid blocking the response if email sending fails
            pass
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SubscribeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = SubscriberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
