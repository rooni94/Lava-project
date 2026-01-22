from rest_framework import serializers

from apps.clients.models import Client, Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source="client.name", read_only=True)

    class Meta:
        model = Testimonial
        fields = "__all__"


class ClientSerializer(serializers.ModelSerializer):
    testimonials = TestimonialSerializer(many=True, read_only=True)

    class Meta:
        model = Client
        fields = "__all__"
