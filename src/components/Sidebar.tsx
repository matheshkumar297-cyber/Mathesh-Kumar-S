import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  ListOrdered, 
  TerminalSquare, 
  FileText, 
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';

export type NavigationPage = 'dashboard' | 'courses' | 'add-course' | 'tests' | 'documentation';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  totalCoursesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  totalCoursesCount
}) => {
  const isCourseActive = currentPage === 'courses' || currentPage === 'add-course';

  const navItemClass = (page: NavigationPage) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      currentPage === page
        ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
    }`;

  const subNavItemClass = (page: NavigationPage) =>
    `flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
      currentPage === page
        ? 'bg-indigo-600 text-white font-semibold shadow-xs shadow-indigo-200'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const handleSelect = (page: NavigationPage) => {
    onNavigate(page);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile header close button */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <span className="font-bold text-slate-800 text-sm">Navigation Menu</span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          <div>
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Core Modules
            </span>
            <nav className="mt-2 space-y-1">
              <button
                id="nav-dashboard"
                onClick={() => handleSelect('dashboard')}
                className={`w-full ${navItemClass('dashboard')}`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                <span>Dashboard</span>
              </button>

              {/* Courses group with sub-links */}
              <div className="pt-1">
                <div className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    Courses
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="pl-3 mt-1 space-y-1 border-l-2 border-slate-100 ml-3">
                  <button
                    id="nav-all-courses"
                    onClick={() => handleSelect('courses')}
                    className={`w-full ${subNavItemClass('courses')}`}
                  >
                    <span className="flex items-center gap-2">
                      <ListOrdered className="w-3.5 h-3.5" />
                      <span>All Courses</span>
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        currentPage === 'courses'
                          ? 'bg-indigo-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {totalCoursesCount}
                    </span>
                  </button>

                  <button
                    id="nav-add-course"
                    onClick={() => handleSelect('add-course')}
                    className={`w-full ${subNavItemClass('add-course')}`}
                  >
                    <span className="flex items-center gap-2">
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Course</span>
                    </span>
                  </button>
                </div>
              </div>
            </nav>
          </div>

          <div>
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Testing & Viva Evaluation
            </span>
            <nav className="mt-2 space-y-1">
              <button
                id="nav-tests"
                onClick={() => handleSelect('tests')}
                className={`w-full ${navItemClass('tests')}`}
              >
                <TerminalSquare className="w-4 h-4 text-indigo-500" />
                <div className="flex items-center justify-between flex-1">
                  <span>API Tests & Postman</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    TC01-15
                  </span>
                </div>
              </button>

              <button
                id="nav-documentation"
                onClick={() => handleSelect('documentation')}
                className={`w-full ${navItemClass('documentation')}`}
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Project Report & Viva</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Academic Project Viva Card footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack CRUD SOP</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              React 19 Frontend + REST API Backend + SQLite storage.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
