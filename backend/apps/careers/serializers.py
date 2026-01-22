from rest_framework import serializers

from apps.careers.models import JobApplication, JobOpening


class JobOpeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOpening
        fields = "__all__"


class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)

    class Meta:
        model = JobApplication
        fields = "__all__"
        read_only_fields = ("status",)
