import React from 'react';
import { Course, CourseStats } from '../types';
import { 
  BookOpen, 
  Activity, 
  Clock, 
  CheckCircle, 
  Users, 
  BadgeDollarSign, 
  Plus, 
  ArrowRight, 
  Eye, 
  Edit3, 
  Trash2, 
  RotateCcw,
  Sparkles,
  Layers,
  TerminalSquare
} from 'lucide-react';

interface DashboardProps {
  stats: CourseStats | null;
  recentCourses: Course[];
  isLoading: boolean;
  onNavigateAdd: () => void;
  onNavigateAll: () => void;
  onViewCourse: (course: Course) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (course: Course) => void;
  onReseedDatabase: () => void;
  onOpenTestRunner: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  recentCourses,
  isLoading,
  onNavigateAdd,
  onNavigateAll,
  onViewCourse,
  onEditCourse,
  onDeleteCourse,
  onReseedDatabase,
  onOpenTestRunner,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Upcoming':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Intermediate':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome with Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-medium mb-2 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Academic Administration Dashboard</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Course Management System
            </h2>
            <p className="text-sm text-indigo-200 mt-1 max-w-xl leading-relaxed">
              Real-time course curriculum administration with SQLite persistent storage, REST API endpoints, and validation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-dash-add-course"
              onClick={onNavigateAdd}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-indigo-900 hover:bg-indigo-50 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Course</span>
            </button>
            <button
              id="btn-dash-run-tests"
              onClick={onOpenTestRunner}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-700/80 hover:bg-indigo-700 text-white border border-indigo-500/40 transition-all"
            >
              <TerminalSquare className="w-4 h-4" />
              <span>Run TC01–15 Tests</span>
            </button>
            <button
              id="btn-dash-reseed"
              onClick={onReseedDatabase}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
              title="Reset SQLite database with initial 5 sample courses"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Samples</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards Grid (Total, Active, Upcoming, Completed) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Courses */}
        <div id="stat-total-courses" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Courses
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {stats?.total_courses ?? (isLoading ? '-' : 0)}
            </span>
            <span className="text-xs text-slate-500 font-medium">Curricula</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Student Capacity:</span>
            <span className="font-semibold text-slate-700">{stats?.total_capacity || 0} seats</span>
          </div>
        </div>

        {/* Card 2: Active Courses */}
        <div id="stat-active-courses" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Courses
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {stats?.active_courses ?? (isLoading ? '-' : 0)}
            </span>
            <span className="text-xs text-emerald-700/80 font-medium">In Session</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Active Ratio:</span>
            <span className="font-semibold text-slate-700">
              {stats?.total_courses ? Math.round((stats.active_courses / stats.total_courses) * 100) : 0}% of catalog
            </span>
          </div>
        </div>

        {/* Card 3: Upcoming Courses */}
        <div id="stat-upcoming-courses" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Upcoming Courses
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-amber-600">
              {stats?.upcoming_courses ?? (isLoading ? '-' : 0)}
            </span>
            <span className="text-xs text-amber-700/80 font-medium">Open for Enrollment</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Next Start:</span>
            <span className="font-semibold text-slate-700">Upcoming term</span>
          </div>
        </div>

        {/* Card 4: Completed Courses */}
        <div id="stat-completed-courses" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Completed Courses
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-blue-600">
              {stats?.completed_courses ?? (isLoading ? '-' : 0)}
            </span>
            <span className="text-xs text-blue-700/80 font-medium">Archived</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Average Fee:</span>
            <span className="font-semibold text-slate-700">₹{stats?.average_fee ? stats.average_fee.toLocaleString() : '0'}</span>
          </div>
        </div>
      </div>

      {/* Secondary Row: Recent Courses Table & Category Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Courses (2 cols on large screen) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Courses</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Recently created or updated academic course offerings
              </p>
            </div>
            <button
              id="btn-view-all-recent"
              onClick={onNavigateAll}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <span>View All Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Course Name</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Fee</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                      No courses found. Click "Add New Course" to get started.
                    </td>
                  </tr>
                ) : (
                  recentCourses.slice(0, 5).map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 text-xs">
                        {c.course_code}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div className="truncate max-w-[180px] sm:max-w-xs" title={c.course_name}>
                          {c.course_name}
                        </div>
                        <span className="text-[11px] text-slate-400 block">{c.department}</span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        {c.instructor}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium border ${getLevelBadge(c.level)}`}>
                          {c.level}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${getStatusBadge(c.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-900 text-xs">
                        ₹{Number(c.fee).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onViewCourse(c)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="View Course Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditCourse(c)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Edit Course"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteCourse(c)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Academic Breakdown & Information Card (1 col) */}
        <div className="space-y-6">
          {/* Department Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Department Distribution</h3>
            </div>
            <div className="space-y-3">
              {stats?.department_breakdown && stats.department_breakdown.length > 0 ? (
                stats.department_breakdown.slice(0, 4).map((d, i) => {
                  const percentage = stats.total_courses > 0 ? Math.round((d.count / stats.total_courses) * 100) : 0;
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700 truncate max-w-[170px]">{d.department}</span>
                        <span className="text-slate-500">{d.count} ({percentage}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400">No department data recorded.</p>
              )}
            </div>
          </div>

          {/* Quick Viva & Architecture Summary */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-5 rounded-2xl text-white shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              CRUD Architecture Verification
            </h4>
            <div className="mt-3 space-y-2 text-xs text-slate-300 leading-relaxed">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <strong>Model:</strong> 18 Schema Fields (Course Code, Fee, Dates...)
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <strong>Endpoints:</strong> GET, POST, PUT, PATCH, DELETE
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <strong>Database:</strong> SQLite with transactional migrations
              </p>
            </div>
            <button
              onClick={onOpenTestRunner}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <TerminalSquare className="w-3.5 h-3.5" />
              <span>Verify All 15 Test Cases</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
