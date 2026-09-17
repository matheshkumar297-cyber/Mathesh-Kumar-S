from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone

class Course(models.Model):
    DURATION_UNIT_CHOICES = [
        ('Hours', 'Hours'),
        ('Days', 'Days'),
        ('Weeks', 'Weeks'),
        ('Months', 'Months'),
    ]

    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    STATUS_CHOICES = [
        ('Upcoming', 'Upcoming'),
        ('Active', 'Active'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    course_code = models.CharField(
        max_length=20,
        unique=True,
        help_text="Unique course code identifier, e.g., CS101"
    )
    course_name = models.CharField(max_length=255)
    description = models.TextField()
    instructor = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    duration = models.PositiveIntegerField(help_text="Duration value, must be greater than 0")
    duration_unit = models.CharField(
        max_length=20,
        choices=DURATION_UNIT_CHOICES,
        default='Weeks'
    )
    credits = models.PositiveIntegerField(help_text="Course credit points, must be greater than 0")
    fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Tuition fee, cannot be negative"
    )
    level = models.CharField(
        max_length=20,
        choices=LEVEL_CHOICES,
        default='Beginner'
    )
    start_date = models.DateField()
    end_date = models.DateField()
    max_students = models.PositiveIntegerField(help_text="Maximum capacity of students")
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Upcoming'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-id']
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'

    def clean(self):
        super().clean()
        if self.duration is not None and self.duration <= 0:
            raise ValidationError({'duration': 'Duration must be greater than 0.'})
        if self.credits is not None and self.credits <= 0:
            raise ValidationError({'credits': 'Credits must be greater than 0.'})
        if self.fee is not None and self.fee < 0:
            raise ValidationError({'fee': 'Fee cannot be negative.'})
        if self.max_students is not None and self.max_students <= 0:
            raise ValidationError({'max_students': 'Maximum students must be greater than 0.'})
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValidationError({'end_date': 'End date cannot be before start date.'})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.course_code} - {self.course_name}"
