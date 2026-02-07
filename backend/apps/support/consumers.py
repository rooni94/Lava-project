import secrets
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.utils import timezone

from .bot import generate_bot_reply, should_handover_to_human
from .models import Conversation, SupportMessage, SupportStaffActivity
from .serializers import SupportMessageSerializer

User = get_user_model()


class SupportChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.conversation_id = int(self.scope["url_route"]["kwargs"]["conversation_id"])
        self.group_name = f"support_{self.conversation_id}"

        qs = parse_qs(self.scope.get("query_string", b"").decode())
        is_guest = "guest" in qs
        guest_token = (qs.get("guest_token") or [None])[0]
        self.scope["is_guest"] = is_guest
        self.scope["guest_token"] = guest_token

        user = self.scope.get("user")
        is_authenticated = bool(
            user and not isinstance(user, AnonymousUser) and getattr(user, "is_authenticated", False)
        )

        allowed = await self.can_join_conversation(
            user=user,
            is_authenticated=is_authenticated,
            is_guest=is_guest,
            guest_token=guest_token,
        )
        if not allowed:
            await self.close()
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    @database_sync_to_async
    def can_join_conversation(self, user, is_authenticated: bool, is_guest: bool, guest_token: str | None) -> bool:
        try:
            conv = Conversation.objects.get(pk=self.conversation_id, is_deleted=False)
        except Conversation.DoesNotExist:
            return False

        if is_guest:
            if not conv.is_guest or not conv.guest_token or not guest_token:
                return False
            return secrets.compare_digest(conv.guest_token, guest_token)

        if not is_authenticated:
            return False

        if getattr(user, "is_superuser", False) or getattr(user, "is_staff", False):
            return True

        if getattr(user, "is_manager", False):
            return True

        return bool(conv.customer_id and conv.customer_id == user.id and not conv.is_guest)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        msg_type = content.get("type")
        if msg_type != "message":
            return

        text = (content.get("content") or "").strip()
        if not text:
            return

        user = self.scope.get("user")
        is_guest = self.scope.get("is_guest", False)
        is_authenticated = bool(
            user and not isinstance(user, AnonymousUser) and getattr(user, "is_authenticated", False)
        )

        message_data, sender_type = await self.create_message(text, is_authenticated, is_guest, user)

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "chat.message",
                "message": message_data,
            },
        )

        if sender_type in ("customer", "guest"):
            bot_user = user if (sender_type == "customer" and is_authenticated) else None
            bot_data = await self.create_bot_message(text, bot_user)
            if bot_data:
                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        "type": "chat.message",
                        "message": bot_data,
                    },
                )

    @database_sync_to_async
    def create_message(self, text: str, is_authenticated: bool, is_guest: bool, user):
        conv = Conversation.objects.get(pk=self.conversation_id)

        if is_guest or not is_authenticated:
            sender_type = "guest"
            msg = SupportMessage.objects.create(
                conversation=conv,
                sender=None,
                sender_type=sender_type,
                content=text,
                is_read_by_customer=True,
                is_read_by_support=False,
            )
        else:
            if conv.customer_id == user.id and not conv.is_guest:
                sender_type = "customer"
            else:
                sender_type = "manager" if getattr(user, "is_manager", False) else "staff"

            msg = SupportMessage.objects.create(
                conversation=conv,
                sender=user,
                sender_type=sender_type,
                content=text,
                is_read_by_customer=sender_type not in ("customer", "guest"),
                is_read_by_support=sender_type in ("customer", "guest"),
            )

        conv.last_message_at = timezone.now()
        conv.save(update_fields=["last_message_at"])

        if is_authenticated and not is_guest and sender_type in ("staff", "manager"):
            target_name = conv.customer_name or conv.guest_name or (conv.customer.username if conv.customer else None)
            target_email = conv.guest_email

            client = self.scope.get("client")
            ip_addr = None
            if client and isinstance(client, (list, tuple)) and len(client) >= 1:
                ip_addr = client[0]

            SupportStaffActivity.objects.create(
                staff=user,
                staff_name=user.username,
                staff_role=getattr(user, "role", None),
                action_type="reply",
                conversation=conv,
                target_name=target_name,
                target_email=target_email,
                message=text[:200],
                ip_address=ip_addr,
            )

        return SupportMessageSerializer(msg).data, sender_type

    @database_sync_to_async
    def create_bot_message(self, text: str, user):
        conv = Conversation.objects.get(pk=self.conversation_id)
        if conv.is_deleted:
            return None

        reply_text: str | None = None

        if should_handover_to_human(text):
            if not conv.bot_disabled:
                conv.bot_disabled = True
                reply_text = (
                    "شكرًا لتواصلك 🤍\n"
                    "تم تحويل المحادثة لأحد موظفي الدعم البشري.\n"
                    "قد يستغرق الرد وقتًا بسيطًا حسب ضغط المحادثات، شكرًا لصبرك."
                )
        elif not conv.bot_disabled:
            reply_text = generate_bot_reply(user, text, conv)

        if not reply_text:
            conv.save(update_fields=["bot_disabled", "last_message_at"])
            return None

        msg = SupportMessage.objects.create(
            conversation=conv,
            sender=None,
            sender_type="bot",
            content=reply_text,
            is_read_by_customer=True,
            is_read_by_support=False,
        )
        conv.last_message_at = timezone.now()
        conv.save(update_fields=["last_message_at", "bot_disabled"])

        return SupportMessageSerializer(msg).data

    async def chat_message(self, event):
        await self.send_json(event["message"])
