from django.utils import timezone
from rest_framework import serializers
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            "id",
            "name",
            "age",
            "gender",
            "ward",
            "department",
            "doctor",
            "admission_date",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        cleaned = " ".join(value.strip().split())
        if not cleaned:
            raise serializers.ValidationError("Name is required.")
        if not cleaned.replace(" ", "").isalpha() or not cleaned.isascii():
            raise serializers.ValidationError("Name must contain letters only.")
        return cleaned

    def validate_age(self, value):
        if value < 0 or value > 120:
            raise serializers.ValidationError("Age must be between 0 and 120.")
        return value

    def validate_admission_date(self, value):
        if value > timezone.localdate():
            raise serializers.ValidationError("Admission date cannot be a future date.")
        return value