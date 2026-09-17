from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Course

class CourseAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.valid_payload = {
            'course_code': 'CS101',
            'course_name': 'Introduction to Python',
            'description': 'Fundamentals of Python programming and logic design.',
            'instructor': 'Dr. Kumar',
            'department': 'Computer Science',
            'category': 'Computer Science',
            'duration': 12,
            'duration_unit': 'Weeks',
            'credits': 4,
            'fee': 5000.00,
            'level': 'Beginner',
            'start_date': '2026-10-01',
            'end_date': '2026-12-24',
            'max_students': 40,
            'status': 'Upcoming'
        }
        self.course = Course.objects.create(**self.valid_payload)

    def test_tc01_add_valid_course(self):
        """TC01: Add valid course -> Course created successfully"""
        payload = self.valid_payload.copy()
        payload['course_code'] = 'CS102'
        response = self.client.post('/api/courses/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['course_code'], 'CS102')

    def test_tc02_submit_empty_form(self):
        """TC02: Submit empty form -> Validation errors displayed"""
        response = self.client.post('/api/courses/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('course_code', response.data)
        self.assertIn('course_name', response.data)

    def test_tc03_duplicate_course_code(self):
        """TC03: Duplicate course code -> Error displayed"""
        payload = self.valid_payload.copy()
        # CS101 is already created in setUp
        response = self.client.post('/api/courses/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('course_code', response.data)

    def test_tc04_invalid_fee(self):
        """TC04: Invalid fee -> Validation error"""
        payload = self.valid_payload.copy()
        payload['course_code'] = 'CS103'
        payload['fee'] = -500.00
        response = self.client.post('/api/courses/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('fee', response.data)

    def test_tc05_invalid_date_range(self):
        """TC05: Invalid date range -> Validation error"""
        payload = self.valid_payload.copy()
        payload['course_code'] = 'CS104'
        payload['start_date'] = '2026-12-31'
        payload['end_date'] = '2026-01-01'
        response = self.client.post('/api/courses/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_tc06_view_all_courses(self):
        """TC06: View all courses -> Courses displayed"""
        response = self.client.get('/api/courses/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_tc07_view_single_course(self):
        """TC07: View single course -> Correct details displayed"""
        response = self.client.get(f'/api/courses/{self.course.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['course_code'], 'CS101')

    def test_tc08_update_course(self):
        """TC08: Update course -> Course updated"""
        response = self.client.patch(f'/api/courses/{self.course.id}/', {'fee': 5500.00}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course.refresh_from_db()
        self.assertEqual(float(self.course.fee), 5500.00)

    def test_tc09_update_invalid_id(self):
        """TC09: Update invalid ID -> 404 error"""
        response = self.client.put('/api/courses/99999/', self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_tc10_delete_course(self):
        """TC10: Delete course -> Course deleted"""
        response = self.client.delete(f'/api/courses/{self.course.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Course.objects.filter(id=self.course.id).exists())

    def test_tc11_delete_invalid_id(self):
        """TC11: Delete invalid ID -> 404 error"""
        response = self.client.delete('/api/courses/99999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_tc12_search_course(self):
        """TC12: Search course -> Matching courses displayed"""
        response = self.client.get('/api/courses/?search=Python')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any('Python' in c['course_name'] for c in response.data))

    def test_tc13_filter_courses(self):
        """TC13: Filter courses -> Correct filtered results displayed"""
        response = self.client.get('/api/courses/?department=Computer Science&status=Upcoming')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(all(c['department'] == 'Computer Science' for c in response.data))
