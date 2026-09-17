import React from 'react';
import { Course } from '../types';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  course,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity">
      <div 
        id="modal-delete-confirm"
        className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 space-y-4"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900">
              Confirm Course Deletion
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to permanently delete this course curriculum from the SQLite database? This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Selected Course summary box */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Course Code:</span>
            <span className="font-mono font-bold text-indigo-700">{course.course_code}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Course Name:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[200px]">{course.course_name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Instructor:</span>
            <span className="text-slate-700">{course.instructor}</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            id="btn-cancel-delete"
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-delete"
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-xs shadow-rose-300 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Deleting...' : 'Confirm Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
