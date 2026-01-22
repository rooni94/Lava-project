from django.contrib import admin

from apps.clients.models import Client, Testimonial


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("name", "rating", "category", "is_featured", "created_at")
    list_filter = ("is_featured", "category")
    search_fields = ("name", "category")


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("client", "author", "rating", "is_featured", "created_at")
    list_filter = ("is_featured", "rating")
    search_fields = ("quote", "client__name", "author")
