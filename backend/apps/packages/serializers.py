from rest_framework import serializers

from apps.packages.models import Package, PackageCategory


class PackageCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageCategory
        fields = "__all__"


class PackageSerializer(serializers.ModelSerializer):
    category = PackageCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=PackageCategory.objects.all(), source="category", write_only=True, allow_null=True, required=False
    )

    class Meta:
        model = Package
        fields = "__all__"
