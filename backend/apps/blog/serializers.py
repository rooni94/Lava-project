from __future__ import annotations

from django.utils import timezone
from rest_framework import serializers

from apps.blog.models import BlogCategory, BlogComment, BlogPost


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = "__all__"


class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.get_full_name", read_only=True)
    comments = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = BlogPost
        fields = "__all__"
        read_only_fields = ("author", "published_at")

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["author"] = request.user
        self._apply_publish(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        self._apply_publish(validated_data, instance)
        return super().update(instance, validated_data)

    def _apply_publish(self, data, instance=None):
        schedule = data.get("scheduled_publish_at")
        now = timezone.now()
        if data.get("is_published") and not data.get("published_at"):
            data["published_at"] = now
        if schedule and schedule <= now:
            data["is_published"] = True
            data["published_at"] = now

    def get_comments(self, obj):
        qs = obj.comments.filter(is_approved=True)
        return BlogCommentSerializer(qs, many=True).data


class BlogCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogComment
        fields = "__all__"
        read_only_fields = ("created_at", "is_approved")
