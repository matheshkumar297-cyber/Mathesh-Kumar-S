import React from 'react';
import { Course } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  Award, 
  Users, 
  DollarSign, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  GraduationCap,
  ShieldCheck,
  Building
} from 'lucide-react';

interface CourseDetailsModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !course) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity">
      <div 
        id="modal-course-details"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-50/80 border-b border-slate-100 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 border border-indigo-200">
                {course.course_code}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(course.status)}`}>
                {course.status}
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${getLevelBadge(course.level)}`}>
                {course.level}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight">
              {course.course_name}
            </h3>
            <p className="text-xs text-indigo-600 font-medium">
              {course.department} • {course.category}
            </p>
          </div>

          <button
            id="btn-close-details"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Course Syllabus / Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Course Description & Syllabus
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 leading-relaxed border border-slate-100">
              {course.description}
            </div>
          </div>

          {/* Academic & Faculty Details Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Curriculum Metadata
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-400 block">Instructor</span>
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  {course.instructor}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-400 block">Duration</span>
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  {course.duration} {course.duration_unit}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-400 block">Credits</span>
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <Award className="w-3.5 h-3.5 text-indigo-500" />
                  {course.credits} Credits
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-400 block">Tuition Fee</span>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  ₹{Number(course.fee).toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-400 block">Maximum Capacity</span>
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                  {course.max_students} Students
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-400 block">Department</span>
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-indigo-500" />
                  {course.department}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Schedule */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Academic Schedule
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div className="flex-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">Commencement Date:</span>
                <span className="font-semibold text-slate-800">{course.start_date}</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">Conclusion Date:</span>
                <span className="font-semibold text-slate-800">{course.end_date}</span>
              </div>
            </div>
          </div>

          {/* System Record Timestamps */}
          {(course.created_at || course.updated_at) && (
            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-4 text-[11px] text-slate-400">
              {course.created_at && (
                <span>Record Created: {new Date(course.created_at).toLocaleString()}</span>
              )}
              {course.updated_at && (
                <span>Last Updated: {new Date(course.updated_at).toLocaleString()}</span>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onDelete(course);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Course</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Close
            </button>
            <button
              id="btn-details-edit"
              onClick={() => {
                onClose();
                onEdit(course);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Course</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
