# backend/apps/support/views.py
import logging

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.core.mail import EmailMessage
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from rest_framework.views import APIView

from .bot import generate_bot_reply, should_handover_to_human
from .models import Conversation, GuestEmailVerification, SupportMessage, SupportStaffActivity
from .permissions import IsSupportAgent
from .serializers import ConversationSerializer, SupportMessageSerializer, SupportStaffActivitySerializer

logger = logging.getLogger(__name__)


def _broadcast_message(conversation_id: int, message_data: dict | None):
    if not message_data:
        return
    layer = get_channel_layer()
    if not layer:
        return
    try:
        async_to_sync(layer.group_send)(
            f"support_{conversation_id}",
            {"type": "chat.message", "message": message_data},
        )
    except Exception:
        logger.exception("Failed to broadcast support message to WS")


def _get_or_create_user_conversation(user):
    conv = (
        Conversation.objects.filter(customer=user, is_closed=False, is_deleted=False)
        .order_by("-created_at")
        .first()
    )
    if not conv:
        conv = Conversation.objects.create(customer=user, is_guest=False)
    return conv


def _send_verification_email(name: str, email: str, code: str) -> None:
    subject = "كود التحقق من البريد – دعم لافا"
    message = (
        f"مرحباً {name},\n\n"
        f"كود التحقق الخاص بك هو: {code}\n"
        "صلاحيته 15 دقيقة.\n\n"
        "تحيات فريق لافا."
    )
    mail = EmailMessage(
        subject=subject,
        body=message,
        from_email=getattr(settings, "NOREPLY_EMAIL", None) or getattr(settings, "DEFAULT_FROM_EMAIL", None),
        to=[email],
    )
    try:
        mail.send(fail_silently=False)
    except Exception:
        logger.exception("Failed to send guest verification email")


class MyConversationView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        conv = (
            Conversation.objects.filter(customer=user, is_closed=False, is_deleted=False)
            .order_by("-created_at")
            .first()
        )

        created = False
        if not conv:
            with transaction.atomic():
                conv = Conversation.objects.create(customer=user, is_guest=False)
                SupportMessage.objects.create(
                    conversation=conv,
                    sender=None,
                    sender_type="bot",
                    content="مرحباً 👋 أنا مساعد لافا. اكتب سؤالك وسأرد عليك فوراً.",
                    is_read_by_customer=True,
                )
                created = True

        data = ConversationSerializer(conv).data
        return Response({"conversation": data, "created": created})


class MyMessagesView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_conversation(self, user):
        return (
            Conversation.objects.filter(customer=user, is_closed=False, is_deleted=False)
            .order_by("-created_at")
            .first()
        )

    def get(self, request, *args, **kwargs):
        conv = self.get_conversation(request.user)
        if not conv:
            return Response({"messages": []})
        msgs = conv.messages.all()
        return Response(SupportMessageSerializer(msgs, many=True).data)

    def post(self, request, *args, **kwargs):
        user = request.user
        content = request.data.get("content", "").strip()
        if not content:
            return Response({"detail": "الرجاء كتابة رسالة."}, status=status.HTTP_400_BAD_REQUEST)

        conv = self.get_conversation(user)
        if not conv:
            conv = Conversation.objects.create(customer=user, is_guest=False)

        msg = SupportMessage.objects.create(
            conversation=conv,
            sender=user,
            sender_type="customer",
            content=content,
            is_read_by_support=False,
            is_read_by_customer=True,
        )
        conv.last_message_at = timezone.now()
        conv.save(update_fields=["last_message_at"])

        _broadcast_message(conv.id, SupportMessageSerializer(msg).data)

        auto_text: str | None = None

        if conv.bot_disabled and not conv.assigned_to:
            conv.bot_disabled = False
            conv.save(update_fields=["bot_disabled"])

        if should_handover_to_human(content):
            if not conv.bot_disabled:
                conv.bot_disabled = True
                conv.save(update_fields=["bot_disabled"])
                auto_text = (
                    "شكرًا لتواصلك 🤍\n"
                    "تم تحويل محادثتك لأحد موظفي الدعم البشري.\n"
                    "قد يستغرق الرد وقتًا بسيطًا، شكرًا لصبرك."
                )
        elif not conv.bot_disabled:
            auto_text = generate_bot_reply(user, content, conv)

        auto_reply_data = None
        if auto_text:
            auto_reply = SupportMessage.objects.create(
                conversation=conv,
                sender=None,
                sender_type="bot",
                content=auto_text,
                is_read_by_customer=False,
                is_read_by_support=True,
            )
            conv.last_message_at = timezone.now()
            conv.save(update_fields=["last_message_at"])
            auto_reply_data = SupportMessageSerializer(auto_reply).data
            _broadcast_message(conv.id, auto_reply_data)

        return Response(
            {
                "customer_message": SupportMessageSerializer(msg).data,
                "bot_reply": auto_reply_data,
            },
            status=status.HTTP_201_CREATED,
        )


class ConversationListView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsSupportAgent]

    def get_queryset(self):
        qs = Conversation.objects.filter(is_deleted=False).order_by("-last_message_at", "-created_at")
        status_param = self.request.query_params.get("status")
        if status_param == "open":
            qs = qs.filter(is_closed=False)
        elif status_param == "closed":
            qs = qs.filter(is_closed=True)
        return qs


class ConversationDetailView(generics.RetrieveAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsSupportAgent]

    def get_queryset(self):
        return Conversation.objects.filter(is_deleted=False)


class ConversationMessagesView(views.APIView):
    permission_classes = [IsSupportAgent]

    def get_object(self, pk):
        return Conversation.objects.get(pk=pk, is_deleted=False)

    def get(self, request, pk, *args, **kwargs):
        try:
            conv = self.get_object(pk)
        except Conversation.DoesNotExist:
            return Response({"detail": "المحادثة غير موجودة."}, status=status.HTTP_404_NOT_FOUND)

        msgs = conv.messages.all()
        conv.messages.filter(is_read_by_support=False).update(is_read_by_support=True)
        return Response(SupportMessageSerializer(msgs, many=True).data)

    def post(self, request, pk, *args, **kwargs):
        try:
            conv = self.get_object(pk)
        except Conversation.DoesNotExist:
            return Response({"detail": "المحادثة غير موجودة."}, status=status.HTTP_404_NOT_FOUND)

        content = request.data.get("content", "").strip()
        if not content:
            return Response({"detail": "الرجاء كتابة رسالة."}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        sender_type = "manager" if getattr(user, "is_manager", False) else "staff"

        msg = SupportMessage.objects.create(
            conversation=conv,
            sender=user,
            sender_type=sender_type,
            content=content,
            is_read_by_customer=False,
            is_read_by_support=True,
        )
        conv.last_message_at = timezone.now()
        if not conv.assigned_to:
            conv.assigned_to = user
        conv.save(update_fields=["last_message_at", "assigned_to"])

        target_name = conv.customer_name or conv.guest_name or (conv.customer.username if conv.customer else None)
        target_email = conv.guest_email

        SupportStaffActivity.objects.create(
            staff=user,
            staff_name=user.username,
            staff_role=getattr(user, "role", None),
            action_type="reply",
            conversation=conv,
            target_name=target_name,
            target_email=target_email,
            message=content[:200],
            ip_address=request.META.get("REMOTE_ADDR") or None,
            user_agent=request.META.get("HTTP_USER_AGENT") or None,
        )

        _broadcast_message(conv.id, SupportMessageSerializer(msg).data)

        return Response(SupportMessageSerializer(msg).data, status=status.HTTP_201_CREATED)


class CloseConversationView(views.APIView):
    permission_classes = [IsSupportAgent]

    def post(self, request, pk, *args, **kwargs):
        try:
            conv = Conversation.objects.get(pk=pk, is_deleted=False)
        except Conversation.DoesNotExist:
            return Response({"detail": "المحادثة غير موجودة."}, status=status.HTTP_404_NOT_FOUND)

        conv.is_closed = True
        conv.closed_at = timezone.now()
        if not conv.closed_by:
            conv.closed_by = request.user
        conv.save(update_fields=["is_closed", "closed_at", "closed_by"])
        return Response({"detail": "تم إغلاق المحادثة."})


class MarkConversationReadView(APIView):
    permission_classes = [IsSupportAgent]

    def post(self, request, pk, *args, **kwargs):
        try:
            conv = Conversation.objects.get(pk=pk, is_deleted=False)
        except Conversation.DoesNotExist:
            return Response({"detail": "المحادثة غير موجودة."}, status=status.HTTP_404_NOT_FOUND)

        conv.messages.filter(is_read_by_support=False).update(is_read_by_support=True)
        return Response({"detail": "تم تعليم الرسائل كمقروءة."})


class GuestRequestCodeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        name = request.data.get("name")
        email = request.data.get("email")
        if not name or not email:
            return Response({"detail": "الاسم والبريد مطلوبان."}, status=status.HTTP_400_BAD_REQUEST)

        code = get_random_string(6, allowed_chars="0123456789")
        obj = GuestEmailVerification.objects.create(
            name=name.strip(),
            email=email.strip(),
            code=code,
        )
        _send_verification_email(name.strip(), email.strip(), code)

        return Response({"request_id": obj.id, "detail": "تم إرسال كود التحقق إلى بريدك."})


class GuestVerifyCodeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        request_id = request.data.get("request_id")
        code = request.data.get("code")

        if not request_id or not code:
            return Response({"detail": "بيانات غير مكتملة."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            obj = GuestEmailVerification.objects.get(id=request_id)
        except GuestEmailVerification.DoesNotExist:
            return Response({"detail": "طلب غير موجود أو منتهي."}, status=status.HTTP_400_BAD_REQUEST)

        if obj.is_expired():
            return Response({"detail": "انتهت صلاحية الكود، الرجاء طلب كود جديد."}, status=status.HTTP_400_BAD_REQUEST)

        if obj.code != code:
            return Response({"detail": "كود التحقق غير صحيح."}, status=status.HTTP_400_BAD_REQUEST)

        obj.is_verified = True
        obj.save(update_fields=["is_verified"])

        with transaction.atomic():
            conv = Conversation.objects.create(
                customer=None,
                customer_name=obj.name,
                guest_name=obj.name,
                guest_email=obj.email,
                is_guest=True,
                guest_token=get_random_string(48),
            )
            SupportMessage.objects.create(
                conversation=conv,
                sender=None,
                sender_type="bot",
                content="مرحباً 👋 تم توثيق بريدك، اكتب سؤالك وسأساعدك.",
                is_read_by_customer=True,
                is_read_by_support=False,
            )

        data = ConversationSerializer(conv).data
        return Response({"conversation": data, "guest_token": conv.guest_token})


class GuestConversationMessagesView(APIView):
    permission_classes = [permissions.AllowAny]

    def _get_guest_token(self, request) -> str:
        return (request.headers.get("X-Guest-Token") or "").strip()

    def _get_conversation(self, pk: int, guest_token: str) -> Conversation:
        return Conversation.objects.get(
            pk=pk,
            is_guest=True,
            guest_token=guest_token,
            is_deleted=False,
        )

    def get(self, request, pk, *args, **kwargs):
        guest_token = self._get_guest_token(request)
        if not guest_token:
            return Response({"detail": "Guest token required."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            conv = self._get_conversation(pk, guest_token)
        except Conversation.DoesNotExist:
            return Response({"detail": "Unauthorized or conversation not found."}, status=status.HTTP_401_UNAUTHORIZED)

        msgs = conv.messages.all()
        conv.messages.filter(is_read_by_customer=False).update(is_read_by_customer=True)
        return Response(SupportMessageSerializer(msgs, many=True).data)

    def post(self, request, pk, *args, **kwargs):
        guest_token = self._get_guest_token(request)
        if not guest_token:
            return Response({"detail": "Guest token required."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            conv = self._get_conversation(pk, guest_token)
        except Conversation.DoesNotExist:
            return Response({"detail": "Unauthorized or conversation not found."}, status=status.HTTP_401_UNAUTHORIZED)

        content = (request.data.get("content") or "").strip()
        if not content:
            return Response({"detail": "Message content is required."}, status=status.HTTP_400_BAD_REQUEST)

        msg = SupportMessage.objects.create(
            conversation=conv,
            sender=None,
            sender_type="guest",
            content=content,
            is_read_by_customer=True,
            is_read_by_support=False,
        )
        conv.last_message_at = timezone.now()
        conv.save(update_fields=["last_message_at"])
        _broadcast_message(conv.id, SupportMessageSerializer(msg).data)

        auto_text: str | None = None
        if should_handover_to_human(content):
            if not conv.bot_disabled:
                conv.bot_disabled = True
                conv.save(update_fields=["bot_disabled"])
                auto_text = "تم تحويل المحادثة للدعم البشري وسيتم الرد قريباً."
        elif not conv.bot_disabled:
            auto_text = generate_bot_reply(None, content, conv)

        auto_reply_data = None
        if auto_text:
            auto_reply = SupportMessage.objects.create(
                conversation=conv,
                sender=None,
                sender_type="bot",
                content=auto_text,
                is_read_by_customer=True,
                is_read_by_support=False,
            )
            conv.last_message_at = timezone.now()
            conv.save(update_fields=["last_message_at"])
            auto_reply_data = SupportMessageSerializer(auto_reply).data
            _broadcast_message(conv.id, auto_reply_data)

        return Response(
            {
                "guest_message": SupportMessageSerializer(msg).data,
                "bot_reply": auto_reply_data,
            },
            status=status.HTTP_201_CREATED,
        )


class DeleteConversationView(APIView):
    permission_classes = [IsSupportAgent]

    def delete(self, request, pk, *args, **kwargs):
        try:
            conv = Conversation.objects.get(pk=pk, is_deleted=False)
        except Conversation.DoesNotExist:
            return Response({"detail": "المحادثة غير موجودة."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if conv.is_guest:
            target_name = conv.guest_name or conv.customer_name or "ضيف"
            target_email = conv.guest_email
        elif conv.customer:
            target_name = getattr(conv.customer, "username", None)
            target_email = getattr(conv.customer, "email", None)
        else:
            target_name = conv.customer_name
            target_email = None

        SupportStaffActivity.objects.create(
            staff=user,
            staff_name=user.username,
            staff_role=getattr(user, "role", None),
            action_type="delete_conversation",
            conversation=conv,
            target_name=target_name,
            target_email=target_email,
            message="حذف المحادثة من لوحة الدعم.",
            ip_address=request.META.get("REMOTE_ADDR") or None,
            user_agent=request.META.get("HTTP_USER_AGENT") or None,
        )

        conv.is_deleted = True
        conv.deleted_at = timezone.now()
        conv.deleted_by = user
        conv.save(update_fields=["is_deleted", "deleted_at", "deleted_by"])

        return Response({"detail": "تم حذف المحادثة."}, status=status.HTTP_204_NO_CONTENT)


class MyCloseConversationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        conv = (
            Conversation.objects.filter(customer=user, is_closed=False, is_deleted=False)
            .order_by("-created_at")
            .first()
        )
        if not conv:
            return Response({"detail": "لا توجد محادثة مفتوحة حالياً."}, status=200)

        conv.is_closed = True
        conv.closed_at = timezone.now()
        if not conv.closed_by:
            conv.closed_by = user
        conv.save(update_fields=["is_closed", "closed_at", "closed_by"])

        return Response({"detail": "تم إنهاء المحادثة. يمكنك فتح محادثة جديدة في أي وقت."}, status=200)


class SupportStaffActivityListView(generics.ListAPIView):
    permission_classes = [IsSupportAgent]
    serializer_class = SupportStaffActivitySerializer

    def get_queryset(self):
        qs = SupportStaffActivity.objects.select_related("staff", "conversation")
        staff_id = self.request.query_params.get("staff")
        if staff_id:
            qs = qs.filter(staff_id=staff_id)
        return qs
