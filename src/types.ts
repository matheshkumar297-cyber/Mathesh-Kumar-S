export interface Course {
  id: number;
  course_code: string;
  course_name: string;
  description: string;
  instructor: string;
  department: string;
  category: string;
  duration: number;
  duration_unit: string;
  credits: number;
  fee: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  start_date: string;
  end_date: string;
  max_students: number;
  status: 'Upcoming' | 'Active' | 'Completed' | 'Cancelled';
  created_at?: string;
  updated_at?: string;
}

export type CourseFormData = Omit<Course, 'id' | 'created_at' | 'updated_at'>;

export interface CourseFilter {
  search: string;
  department: string;
  category: string;
  level: string;
  status: string;
  ordering: string;
}

export interface CourseStats {
  total_courses: number;
  active_courses: number;
  upcoming_courses: number;
  completed_courses: number;
  cancelled_courses: number;
  total_capacity: number;
  average_fee: number;
  department_breakdown: { department: string; count: number }[];
  category_breakdown: { category: string; count: number }[];
}

export type FormValidationErrors = Partial<Record<keyof CourseFormData, string>>;

export interface TestCaseResult {
  id: string;
  name: string;
  expected: string;
  actual?: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  httpStatus?: number;
  details?: any;
  durationMs?: number;
}

export const CATEGORIES = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Management',
  'Data Science',
  'Artificial Intelligence',
  'Cyber Security',
  'Other'
] as const;

export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Mathematics & Computing',
  'Electrical Engineering'
] as const;

export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const STATUSES = ['Upcoming', 'Active', 'Completed', 'Cancelled'] as const;

export const DURATION_UNITS = ['Weeks', 'Months', 'Hours', 'Semesters'] as const;
