from __future__ import annotations

from rest_framework import serializers

from apps.portfolio.models import Project, ProjectImage, Technology


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = "__all__"


class ProjectSerializer(serializers.ModelSerializer):
    technologies = TechnologySerializer(many=True, read_only=True)
    technology_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Technology.objects.all(), source="technologies", write_only=True, required=False
    )
    images = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    cover_image = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Project
        fields = "__all__"

    def create(self, validated_data):
        self._apply_schedule(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        self._apply_schedule(validated_data)
        return super().update(instance, validated_data)

    def _apply_schedule(self, data):
        from django.utils import timezone

        schedule = data.get("scheduled_publish_at")
        if schedule and schedule <= timezone.now():
            data["status"] = "done"


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = "__all__"
