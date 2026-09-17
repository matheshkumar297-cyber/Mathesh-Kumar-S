import React, { useState, useEffect } from 'react';
import { 
  Course, 
  CourseFormData, 
  FormValidationErrors, 
  CATEGORIES, 
  DEPARTMENTS, 
  LEVELS, 
  STATUSES, 
  DURATION_UNITS 
} from '../types';
import { 
  BookOpen, 
  Save, 
  RotateCcw, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  Award,
  ArrowLeft
} from 'lucide-react';

interface CourseFormProps {
  initialCourse?: Course | null;
  existingCourses: Course[];
  onSubmit: (formData: CourseFormData, isEdit: boolean, id?: number) => Promise<boolean>;
  onCancel: () => void;
  isLoading: boolean;
  serverErrors?: Record<string, string[]>;
}

const DEFAULT_FORM: CourseFormData = {
  course_code: '',
  course_name: '',
  description: '',
  instructor: '',
  department: '',
  category: '',
  duration: 12,
  duration_unit: 'Weeks',
  credits: 4,
  fee: 5000,
  level: 'Beginner',
  start_date: '',
  end_date: '',
  max_students: 40,
  status: 'Upcoming'
};

export const CourseForm: React.FC<CourseFormProps> = ({
  initialCourse,
  existingCourses,
  onSubmit,
  onCancel,
  isLoading,
  serverErrors
}) => {
  const isEdit = Boolean(initialCourse && initialCourse.id);

  const [formData, setFormData] = useState<CourseFormData>(() => {
    if (initialCourse) {
      return {
        course_code: initialCourse.course_code || '',
        course_name: initialCourse.course_name || '',
        description: initialCourse.description || '',
        instructor: initialCourse.instructor || '',
        department: initialCourse.department || '',
        category: initialCourse.category || '',
        duration: initialCourse.duration || 12,
        duration_unit: initialCourse.duration_unit || 'Weeks',
        credits: initialCourse.credits || 4,
        fee: initialCourse.fee ?? 0,
        level: initialCourse.level || 'Beginner',
        start_date: initialCourse.start_date || '',
        end_date: initialCourse.end_date || '',
        max_students: initialCourse.max_students || 30,
        status: initialCourse.status || 'Upcoming'
      };
    }
    return DEFAULT_FORM;
  });

  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialCourse) {
      setFormData({
        course_code: initialCourse.course_code,
        course_name: initialCourse.course_name,
        description: initialCourse.description,
        instructor: initialCourse.instructor,
        department: initialCourse.department,
        category: initialCourse.category,
        duration: initialCourse.duration,
        duration_unit: initialCourse.duration_unit,
        credits: initialCourse.credits,
        fee: initialCourse.fee,
        level: initialCourse.level,
        start_date: initialCourse.start_date,
        end_date: initialCourse.end_date,
        max_students: initialCourse.max_students,
        status: initialCourse.status
      });
      setErrors({});
      setTouched({});
    }
  }, [initialCourse]);

  // Client-side validation function
  const validate = (data: CourseFormData): FormValidationErrors => {
    const errs: FormValidationErrors = {};

    // 1. Course code
    if (!data.course_code || !data.course_code.trim()) {
      errs.course_code = 'Course code cannot be empty.';
    } else {
      const normalizedCode = data.course_code.trim().toUpperCase();
      const duplicate = existingCourses.find(
        (c) => c.course_code.toUpperCase() === normalizedCode && (!isEdit || c.id !== initialCourse?.id)
      );
      if (duplicate) {
        errs.course_code = 'Course code must be unique. Another course already uses this code.';
      }
    }

    // 2. Course name
    if (!data.course_name || !data.course_name.trim()) {
      errs.course_name = 'Course name cannot be empty.';
    }

    // 3. Description
    if (!data.description || !data.description.trim()) {
      errs.description = 'Description cannot be empty.';
    }

    // 4. Instructor
    if (!data.instructor || !data.instructor.trim()) {
      errs.instructor = 'Instructor cannot be empty.';
    }

    // 5. Department
    if (!data.department || !data.department.trim()) {
      errs.department = 'Department must be selected.';
    }

    // 6. Category
    if (!data.category || !data.category.trim()) {
      errs.category = 'Category must be selected.';
    }

    // 7. Duration
    if (data.duration === undefined || data.duration === null || isNaN(Number(data.duration)) || Number(data.duration) <= 0) {
      errs.duration = 'Duration must be greater than 0.';
    }

    // 8. Credits
    if (data.credits === undefined || data.credits === null || isNaN(Number(data.credits)) || Number(data.credits) <= 0) {
      errs.credits = 'Credits must be greater than 0.';
    }

    // 9. Fee
    if (data.fee === undefined || data.fee === null || isNaN(Number(data.fee)) || Number(data.fee) < 0) {
      errs.fee = 'Fee cannot be negative.';
    }

    // 10. Start date
    if (!data.start_date) {
      errs.start_date = 'Start date cannot be empty.';
    }

    // 11. End date & comparison
    if (!data.end_date) {
      errs.end_date = 'End date cannot be empty.';
    } else if (data.start_date && new Date(data.end_date) < new Date(data.start_date)) {
      errs.end_date = 'End date cannot be before start date.';
    }

    // 12. Maximum students
    if (data.max_students === undefined || data.max_students === null || isNaN(Number(data.max_students)) || Number(data.max_students) <= 0) {
      errs.max_students = 'Maximum students must be greater than 0.';
    }

    // 13. Level
    if (!data.level) {
      errs.level = 'Level must be selected.';
    }

    // 14. Status
    if (!data.status) {
      errs.status = 'Status must be selected.';
    }

    return errs;
  };

  const handleChange = (field: keyof CourseFormData, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (touched[field]) {
      const validationErrs = validate(updated);
      setErrors(validationErrs);
    }
  };

  const handleBlur = (field: keyof CourseFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrs = validate(formData);
    setErrors(validationErrs);
  };

  const handleReset = () => {
    if (isEdit && initialCourse) {
      setFormData({
        course_code: initialCourse.course_code,
        course_name: initialCourse.course_name,
        description: initialCourse.description,
        instructor: initialCourse.instructor,
        department: initialCourse.department,
        category: initialCourse.category,
        duration: initialCourse.duration,
        duration_unit: initialCourse.duration_unit,
        credits: initialCourse.credits,
        fee: initialCourse.fee,
        level: initialCourse.level,
        start_date: initialCourse.start_date,
        end_date: initialCourse.end_date,
        max_students: initialCourse.max_students,
        status: initialCourse.status
      });
    } else {
      setFormData(DEFAULT_FORM);
    }
    setErrors({});
    setTouched({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all touched
    const allTouched: Record<string, boolean> = {};
    (Object.keys(formData) as Array<keyof CourseFormData>).forEach((k) => {
      allTouched[k] = true;
    });
    setTouched(allTouched);

    const validationErrs = validate(formData);
    setErrors(validationErrs);

    if (Object.keys(validationErrs).length > 0) {
      return;
    }

    const payload: CourseFormData = {
      ...formData,
      course_code: formData.course_code.trim().toUpperCase(),
      course_name: formData.course_name.trim(),
      description: formData.description.trim(),
      instructor: formData.instructor.trim(),
      department: formData.department.trim(),
      category: formData.category.trim(),
      duration: Number(formData.duration),
      credits: Number(formData.credits),
      fee: Number(formData.fee),
      max_students: Number(formData.max_students)
    };

    await onSubmit(payload, isEdit, initialCourse?.id);
  };

  // Helper for field error text
  const getFieldError = (field: keyof CourseFormData): string | undefined => {
    if (serverErrors && serverErrors[field] && serverErrors[field].length > 0) {
      return serverErrors[field][0];
    }
    if (touched[field] && errors[field]) {
      return errors[field];
    }
    return undefined;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Return to Course List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isEdit ? `Edit Course: ${initialCourse?.course_code}` : 'Add New Course'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit
                ? 'Update existing curriculum parameters, scheduling, and metadata.'
                : 'Define a new curriculum, instructor details, duration, and tuition fee.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              1. Basic Course Identification
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">* Required fields</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Course Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Course Code <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-course-code"
                type="text"
                placeholder="e.g. CS101, AI301"
                value={formData.course_code}
                onChange={(e) => handleChange('course_code', e.target.value.toUpperCase())}
                onBlur={() => handleBlur('course_code')}
                className={`w-full px-3 py-2 rounded-xl border text-sm font-mono uppercase transition-all ${
                  getFieldError('course_code')
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {getFieldError('course_code') && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{getFieldError('course_code')}</span>
                </p>
              )}
            </div>

            {/* Course Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Course Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-course-name"
                type="text"
                placeholder="e.g. Introduction to Python Programming"
                value={formData.course_name}
                onChange={(e) => handleChange('course_name', e.target.value)}
                onBlur={() => handleBlur('course_name')}
                className={`w-full px-3 py-2 rounded-xl border text-sm transition-all ${
                  getFieldError('course_name')
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {getFieldError('course_name') && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{getFieldError('course_name')}</span>
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Course Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="input-course-description"
              rows={3}
              placeholder="Provide a comprehensive summary of syllabus, topics covered, target outcomes, and prerequisites..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              className={`w-full px-3 py-2 rounded-xl border text-sm transition-all ${
                getFieldError('description')
                  ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
            />
            {getFieldError('description') && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{getFieldError('description')}</span>
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Department, Faculty & Academic Classification */}
        <div className="space-y-4 pt-2">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              2. Academic Faculty & Categorization
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Instructor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Instructor <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-course-instructor"
                type="text"
                placeholder="e.g. Dr. Kumar, Prof. Sarah Jenkins"
                value={formData.instructor}
                onChange={(e) => handleChange('instructor', e.target.value)}
                onBlur={() => handleBlur('instructor')}
                className={`w-full px-3 py-2 rounded-xl border text-sm transition-all ${
                  getFieldError('instructor')
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {getFieldError('instructor') && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{getFieldError('instructor')}</span>
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-course-department"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                onBlur={() => handleBlur('department')}
                className={`w-full px-3 py-2 rounded-xl border text-sm transition-all ${
                  getFieldError('department')
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              >
                <option value="">-- Select Department --</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {getFieldError('department') && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{getFieldError('department')}</span>
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-course-category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                onBlur={() => handleBlur('category')}
                className={`w-full px-3 py-2 rounded-xl border text-sm transition-all ${
                  getFieldError('category')
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              >
                <option value="">-- Select Category --</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {getFieldError('category') && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{getFieldError('category')}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Duration, Credits, Fee, and Capacity */}
        <div className="space-y-4 pt-2">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              3. Curriculum Structure, Fees & Capacity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Duration and Unit */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Duration <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="input-course-duration"
                  type="number"
                  min="1"
                  placeholder="12"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  onBlur={() => handleBlur('duration')}
                  className={`w-1/2 px-3 py-2 rounded-xl border text-sm transition-all ${
                    getFieldError('duration')
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-slate-200 bg-white'
                  }`}
                />
                <select
                  id="select-course-duration-unit"
                  value={formData.duration_unit}
                  onChange={(e) => handleChange('duration_unit', e.target.value)}
                  className="w-1/2 px-2 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                >
                  {DURATION_UNITS.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              {getFieldError('duration') && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{getFieldError('duration')}</span>
                </p>
              )}
            </div>

            {/* Credits */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Credits <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-course-credits"
                type="number"
                min="1"
                placeholder="4"
                value={formData.credits}
                onChange={(e) => handleChange('credits', e.target.value)}
                onBlur={() => handleBlur('credits')}
                className={`w-full px-3 py-2 rounded-xl border text-sm transition-all ${
                  getFieldError('credits')
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {getFieldError('credits') && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{getFieldError('credits')}</span>
                </p>
              )}
            </div>

            {/* Fee */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tuition Fee (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-course-fee"
                type="number"
                min="0"
                step="50"
                placeholder="5000"
                value={formData.fee}
                onChange={(e) => handleChange('fee', e.target.value)}
                onBlur={() => handleBlur('fee')}
                className={`w-full px-3 py-2 rounded-xl border text-sm transition-all ${
                  getFieldError('fee')
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {getFieldError('fee') && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{getFieldError('fee')}</span>
                </p>
              )}
            </div>

            {/* Maximum Students */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Max Student Seats <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-course-max-students"
                type="number"
                min="1"
                placeholder="40"
                value={formData.max_students}
                onChange={(e) => handleChange('max_students', e.target.value)}
                onBlur={() => handleBlur('max_students')}
                className={`w-full px-3 py-2 rounded-xl border text-sm transition-all ${
                  getFieldError('max_students')
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {getFieldError('max_students') && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{getFieldError('max_students')}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Schedule, Level & Status */}
        <div className="space-y-4 pt-2">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              4. Schedule, Proficiency Level & Status
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Course Level <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-course-level"
                value={formData.level}
                onChange={(e) => handleChange('level', e.target.value)}
                onBlur={() => handleBlur('level')}
                className={`w-full px-3 py-2 rounded-xl border text-sm transition-all ${
                  getFieldError('level')
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
              {getFieldError('level') && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{getFieldError('level')}</span>
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Course Status <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-course-status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                onBlur={() => handleBlur('status')}
                className={`w-full px-3 py-2 rounded-xl border text-sm transition-all ${
                  getFieldError('status')
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              {getFieldError('status') && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{getFieldError('status')}</span>
                </p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-course-start-date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                onBlur={() => handleBlur('start_date')}
                className={`w-full px-3 py-2 rounded-xl border text-sm transition-all ${
                  getFieldError('start_date')
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {getFieldError('start_date') && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{getFieldError('start_date')}</span>
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                End Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-course-end-date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                onBlur={() => handleBlur('end_date')}
                className={`w-full px-3 py-2 rounded-xl border text-sm transition-all ${
                  getFieldError('end_date')
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {getFieldError('end_date') && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{getFieldError('end_date')}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: Add/Update, Reset, Cancel */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            id="btn-form-reset"
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Form</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <button
              id="btn-form-cancel"
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-form-submit"
              type="submit"
              disabled={isLoading}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : isEdit ? 'Update Course' : 'Add Course'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
