from django.contrib import admin

from apps.core.models import (
    ActivityLog,
    ContactInfo,
    ContactMessage,
    MediaFile,
    Page,
    Section,
    SiteSettings,
    Subscriber,
)


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("site_name", "tagline", "primary_color", "updated_at")


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = ("name", "slug", "title")
    search_fields = ("name", "title", "slug")


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ("title", "page", "order")
    list_filter = ("page",)
    ordering = ("page", "order")


@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ("location", "phone", "email")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "service_type", "topic", "language", "status", "is_handled", "created_at")
    list_filter = ("is_handled", "service_type", "topic", "language", "status")
    search_fields = ("name", "email", "message")


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "created_at", "source")
    search_fields = ("email",)


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ("actor", "action", "created_at")
    search_fields = ("actor__username", "action")


@admin.register(MediaFile)
class MediaFileAdmin(admin.ModelAdmin):
    list_display = ("file", "media_type", "category", "created_at")
    list_filter = ("media_type", "category")
