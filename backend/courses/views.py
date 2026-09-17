from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, Avg
from .models import Course
from .serializers import CourseSerializer

class CourseListCreateView(APIView):
    """
    GET  /api/courses/ - List all courses with filtering & search
    POST /api/courses/ - Create a new course with validation
    """
    def get(self, request):
        queryset = Course.objects.all()

        # Search filter (course_name, course_code, instructor)
        search_query = request.query_params.get('search', '').strip()
        if search_query:
            queryset = queryset.filter(
                Q(course_name__icontains=search_query) |
                Q(course_code__icontains=search_query) |
                Q(instructor__icontains=search_query)
            )

        # Department filter
        department = request.query_params.get('department')
        if department and department != 'All':
            queryset = queryset.filter(department=department)

        # Category filter
        category = request.query_params.get('category')
        if category and category != 'All':
            queryset = queryset.filter(category=category)

        # Level filter
        level = request.query_params.get('level')
        if level and level != 'All':
            queryset = queryset.filter(level=level)

        # Status filter
        course_status = request.query_params.get('status')
        if course_status and course_status != 'All':
            queryset = queryset.filter(status=course_status)

        # Ordering
        ordering = request.query_params.get('ordering', '-id')
        queryset = queryset.order_by(ordering)

        serializer = CourseSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CourseDetailView(APIView):
    """
    GET    /api/courses/<id>/ - View individual course details
    PUT    /api/courses/<id>/ - Full update
    PATCH  /api/courses/<id>/ - Partial update
    DELETE /api/courses/<id>/ - Delete course
    """
    def get_object(self, pk):
        try:
            return Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return None

    def get(self, request, pk):
        course = self.get_object(pk)
        if not course:
            return Response({"detail": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = CourseSerializer(course)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        course = self.get_object(pk)
        if not course:
            return Response({"detail": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        course = self.get_object(pk)
        if not course:
            return Response({"detail": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        course = self.get_object(pk)
        if not course:
            return Response({"detail": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def course_stats_view(request):
    """
    GET /api/stats/ - Statistical aggregates for dashboard overview
    """
    total_courses = Course.objects.count()
    active_courses = Course.objects.filter(status='Active').count()
    upcoming_courses = Course.objects.filter(status='Upcoming').count()
    completed_courses = Course.objects.filter(status='Completed').count()
    cancelled_courses = Course.objects.filter(status='Cancelled').count()

    total_capacity = sum([c.max_students for c in Course.objects.all()])
    average_fee = Course.objects.aggregate(Avg('fee'))['fee__avg'] or 0

    return Response({
        'total_courses': total_courses,
        'active_courses': active_courses,
        'upcoming_courses': upcoming_courses,
        'completed_courses': completed_courses,
        'cancelled_courses': cancelled_courses,
        'total_capacity': total_capacity,
        'average_fee': round(float(average_fee), 2)
    }, status=status.HTTP_200_OK)
