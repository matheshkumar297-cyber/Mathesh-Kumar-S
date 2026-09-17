from django.urls import path
from .views import CourseListCreateView, CourseDetailView, course_stats_view

urlpatterns = [
    path('courses/', CourseListCreateView.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('stats/', course_stats_view, name='course-stats'),
]
