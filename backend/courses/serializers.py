from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'id',
            'course_code',
            'course_name',
            'description',
            'instructor',
            'department',
            'category',
            'duration',
            'duration_unit',
            'credits',
            'fee',
            'level',
            'start_date',
            'end_date',
            'max_students',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_course_code(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Course code cannot be empty.")
        val_upper = value.strip().upper()
        # Check uniqueness during create or when changing code during update
        course_id = self.instance.id if self.instance else None
        duplicate = Course.objects.filter(course_code__iexact=val_upper).exclude(id=course_id)
        if duplicate.exists():
            raise serializers.ValidationError("Course code must be unique.")
        return val_upper

    def validate_duration(self, value):
        if value is None or value <= 0:
            raise serializers.ValidationError("Duration must be greater than 0.")
        return value

    def validate_credits(self, value):
        if value is None or value <= 0:
            raise serializers.ValidationError("Credits must be greater than 0.")
        return value

    def validate_fee(self, value):
        if value is None or value < 0:
            raise serializers.ValidationError("Fee cannot be negative.")
        return value

    def validate_max_students(self, value):
        if value is None or value <= 0:
            raise serializers.ValidationError("Maximum students must be greater than 0.")
        return value

    def validate(self, data):
        # Validate date range
        start_date = data.get('start_date') or (self.instance.start_date if self.instance else None)
        end_date = data.get('end_date') or (self.instance.end_date if self.instance else None)

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                "end_date": "End date cannot be before start date."
            })

        return data
