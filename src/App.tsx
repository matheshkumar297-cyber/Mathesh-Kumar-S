import React, { useState, useEffect, useCallback } from 'react';
import { Course, CourseFilter, CourseFormData, CourseStats } from './types';
import { courseApi, ApiError } from './services/api';
import { Header } from './components/Header';
import { Sidebar, NavigationPage } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CourseList } from './components/CourseList';
import { CourseForm } from './components/CourseForm';
import { CourseDetailsModal } from './components/CourseDetailsModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { ApiTestRunner } from './components/ApiTestRunner';
import { DocumentationModal } from './components/DocumentationModal';
import { ToastContainer, ToastMessage } from './components/Toast';

const DEFAULT_FILTER: CourseFilter = {
  search: '',
  department: 'All',
  category: 'All',
  level: 'All',
  status: 'All',
  ordering: '-id',
};

export default function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [filter, setFilter] = useState<CourseFilter>(DEFAULT_FILTER);

  // Modals & Active Selections
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formServerErrors, setFormServerErrors] = useState<Record<string, string[]>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch courses from REST API
  const fetchCourses = useCallback(async (currentFilter: CourseFilter) => {
    setIsLoading(true);
    try {
      const data = await courseApi.getAll(currentFilter);
      setCourses(data);
    } catch (err: any) {
      addToast('error', 'Error Fetching Courses', err.message || 'Could not load courses from backend API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch stats from REST API
  const fetchStats = useCallback(async () => {
    try {
      const data = await courseApi.getStats();
      setStats(data);
    } catch (err: any) {
      console.error('Failed to load stats', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCourses(filter);
    fetchStats();
  }, [fetchCourses, fetchStats, filter]);

  // Handlers for filter
  const handleFilterChange = (newFilter: CourseFilter) => {
    setFilter(newFilter);
  };

  const handleClearFilters = () => {
    setFilter(DEFAULT_FILTER);
  };

  // Reseed Database
  const handleReseedDatabase = async () => {
    try {
      setIsLoading(true);
      const res = await courseApi.reseed();
      addToast('success', 'Database Reset', `${res.message}. Loaded initial sample courses.`);
      await fetchCourses(filter);
      await fetchStats();
    } catch (err: any) {
      addToast('error', 'Reseed Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to Add
  const handleNavigateAdd = () => {
    setEditingCourse(null);
    setFormServerErrors({});
    setCurrentPage('add-course');
  };

  // Start Edit
  const handleStartEdit = (course: Course) => {
    setEditingCourse(course);
    setFormServerErrors({});
    setCurrentPage('add-course');
  };

  // Submit Course Form (Create or Update)
  const handleFormSubmit = async (
    formData: CourseFormData,
    isEdit: boolean,
    id?: number
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setFormServerErrors({});

    try {
      if (isEdit && id) {
        const updated = await courseApi.update(id, formData);
        addToast(
          'success',
          'Course Updated Successfully',
          `Course ${updated.course_code}: ${updated.course_name} has been updated in the database.`
        );
      } else {
        const created = await courseApi.create(formData);
        addToast(
          'success',
          'Course Created Successfully',
          `Course ${created.course_code}: ${created.course_name} has been added to the database.`
        );
      }

      setEditingCourse(null);
      setCurrentPage('courses');
      await fetchCourses(filter);
      await fetchStats();
      return true;
    } catch (err: any) {
      if (err instanceof ApiError && err.fieldErrors) {
        setFormServerErrors(err.fieldErrors);
        addToast('error', 'Validation Error', 'Please check the highlighted fields below.');
      } else {
        addToast('error', 'Operation Failed', err.message || 'Failed to save course data.');
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete course
  const handleConfirmDelete = async () => {
    if (!deletingCourse) return;

    setIsDeleting(true);
    try {
      await courseApi.delete(deletingCourse.id);
      addToast(
        'success',
        'Course Deleted',
        `Course ${deletingCourse.course_code} has been removed permanently from the database.`
      );
      setDeletingCourse(null);
      if (viewingCourse?.id === deletingCourse.id) {
        setViewingCourse(null);
      }
      await fetchCourses(filter);
      await fetchStats();
    } catch (err: any) {
      addToast('error', 'Delete Failed', err.message || 'Could not delete course.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Top Header */}
      <Header
        totalCourses={courses.length}
        onNavigateAdd={handleNavigateAdd}
        onOpenTestRunner={() => setCurrentPage('tests')}
        onOpenDocs={() => setIsDocsOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Layout Body with Sidebar */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => {
            if (page === 'documentation') {
              setIsDocsOpen(true);
            } else {
              setCurrentPage(page);
            }
          }}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          totalCoursesCount={courses.length}
        />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentPage === 'dashboard' && (
            <Dashboard
              stats={stats}
              recentCourses={courses}
              isLoading={isLoading}
              onNavigateAdd={handleNavigateAdd}
              onNavigateAll={() => setCurrentPage('courses')}
              onViewCourse={(c) => setViewingCourse(c)}
              onEditCourse={handleStartEdit}
              onDeleteCourse={(c) => setDeletingCourse(c)}
              onReseedDatabase={handleReseedDatabase}
              onOpenTestRunner={() => setCurrentPage('tests')}
            />
          )}

          {currentPage === 'courses' && (
            <CourseList
              courses={courses}
              isLoading={isLoading}
              filter={filter}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onViewCourse={(c) => setViewingCourse(c)}
              onEditCourse={handleStartEdit}
              onDeleteCourse={(c) => setDeletingCourse(c)}
              onNavigateAdd={handleNavigateAdd}
            />
          )}

          {currentPage === 'add-course' && (
            <CourseForm
              initialCourse={editingCourse}
              existingCourses={courses}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setEditingCourse(null);
                setCurrentPage('courses');
              }}
              isLoading={isSubmitting}
              serverErrors={formServerErrors}
            />
          )}

          {currentPage === 'tests' && (
            <ApiTestRunner />
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <CourseDetailsModal
        course={viewingCourse}
        isOpen={Boolean(viewingCourse)}
        onClose={() => setViewingCourse(null)}
        onEdit={(c) => {
          setViewingCourse(null);
          handleStartEdit(c);
        }}
        onDelete={(c) => {
          setViewingCourse(null);
          setDeletingCourse(c);
        }}
      />

      <DeleteConfirmationModal
        course={deletingCourse}
        isOpen={Boolean(deletingCourse)}
        onClose={() => setDeletingCourse(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      <DocumentationModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
