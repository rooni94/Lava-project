from django.contrib import admin

from .models import Conversation, SupportMessage, GuestEmailVerification, SupportStaffActivity


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "guest_email", "is_closed", "is_deleted", "last_message_at")
    list_filter = ("is_closed", "is_deleted", "is_guest")
    search_fields = ("guest_email", "guest_name", "customer_name", "customer__email")


@admin.register(SupportMessage)
class SupportMessageAdmin(admin.ModelAdmin):
    list_display = ("id", "conversation", "sender_type", "created_at")
    list_filter = ("sender_type",)
    search_fields = ("content",)


@admin.register(GuestEmailVerification)
class GuestEmailVerificationAdmin(admin.ModelAdmin):
    list_display = ("email", "code", "created_at", "is_verified")
    search_fields = ("email", "name")
    list_filter = ("is_verified",)


@admin.register(SupportStaffActivity)
class SupportStaffActivityAdmin(admin.ModelAdmin):
    list_display = ("id", "staff_name", "action_type", "created_at")
    list_filter = ("action_type",)
    search_fields = ("staff_name", "target_name", "target_email")
