from django.contrib import admin
from .models import Course

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        'course_code',
        'course_name',
        'instructor',
        'department',
        'category',
        'level',
        'duration',
        'duration_unit',
        'credits',
        'fee',
        'status',
        'start_date'
    )
    list_filter = ('department', 'category', 'level', 'status')
    search_fields = ('course_code', 'course_name', 'instructor', 'department')
    ordering = ('-id',)
    date_hierarchy = 'start_date'
