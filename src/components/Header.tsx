import React from 'react';
import { 
  GraduationCap, 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  Menu, 
  Database,
  TerminalSquare
} from 'lucide-react';

interface HeaderProps {
  totalCourses: number;
  onNavigateAdd: () => void;
  onOpenTestRunner: () => void;
  onOpenDocs: () => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCourses,
  onNavigateAdd,
  onOpenTestRunner,
  onOpenDocs,
  onToggleMobileMenu
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3.5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-200">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Course Management System
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                REST API Live
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              CRUD Operations • SQLite Database Engine • DRF Standard
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick database stats pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span>SQLite:</span>
          <span className="font-semibold text-slate-900">{totalCourses} Courses</span>
        </div>

        {/* Postman & API Tests button */}
        <button
          id="btn-header-tests"
          onClick={onOpenTestRunner}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
          title="Run System Test Suite & Postman Collection"
        >
          <TerminalSquare className="w-4 h-4" />
          <span className="hidden sm:inline">API Tests (TC01–15)</span>
          <span className="sm:hidden">Tests</span>
        </button>

        {/* Project Report & Viva button */}
        <button
          id="btn-header-docs"
          onClick={onOpenDocs}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-colors"
          title="Open Project Documentation & College Viva Report"
        >
          <FileText className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline">Report & Viva</span>
          <span className="sm:hidden">Docs</span>
        </button>

        {/* Add Course CTA button */}
        <button
          id="btn-header-add"
          onClick={onNavigateAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs shadow-indigo-300 transition-all hover:shadow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>
    </header>
  );
};
