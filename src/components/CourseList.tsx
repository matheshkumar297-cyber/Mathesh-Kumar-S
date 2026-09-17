import React, { useState } from 'react';
import { Course, CourseFilter, CATEGORIES, DEPARTMENTS, LEVELS, STATUSES } from '../types';
import { 
  Search, 
  Filter, 
  X, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus, 
  LayoutGrid, 
  Table as TableIcon, 
  Calendar, 
  Clock, 
  Award, 
  Users, 
  DollarSign, 
  ArrowUpDown,
  BookOpen
} from 'lucide-react';

interface CourseListProps {
  courses: Course[];
  isLoading: boolean;
  filter: CourseFilter;
  onFilterChange: (newFilter: CourseFilter) => void;
  onClearFilters: () => void;
  onViewCourse: (course: Course) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (course: Course) => void;
  onNavigateAdd: () => void;
}

export const CourseList: React.FC<CourseListProps> = ({
  courses,
  isLoading,
  filter,
  onFilterChange,
  onClearFilters,
  onViewCourse,
  onEditCourse,
  onDeleteCourse,
  onNavigateAdd,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filter, search: e.target.value });
  };

  const handleSelectChange = (key: keyof CourseFilter, value: string) => {
    onFilterChange({ ...filter, [key]: value });
  };

  const hasActiveFilters = 
    Boolean(filter.search) || 
    filter.department !== 'All' || 
    filter.category !== 'All' || 
    filter.level !== 'All' || 
    filter.status !== 'All';

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
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Course Directory</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {courses.length} {courses.length === 1 ? 'course' : 'courses'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse, search, filter, and maintain active educational curricula.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle Switch */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              id="btn-view-table"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden md:inline">Table</span>
            </button>
            <button
              id="btn-view-cards"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">Cards</span>
            </button>
          </div>

          <button
            id="btn-course-list-add"
            onClick={onNavigateAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar Container */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="input-search-courses"
            type="text"
            placeholder="Search by Course Name, Course Code (e.g. CS101), Instructor, or Department..."
            value={filter.search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-white focus:bg-white"
          />
          {filter.search && (
            <button
              onClick={() => onFilterChange({ ...filter, search: '' })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              id="filter-department"
              value={filter.department}
              onChange={(e) => handleSelectChange('department', e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              id="filter-category"
              value={filter.category}
              onChange={(e) => handleSelectChange('category', e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Level
            </label>
            <select
              id="filter-level"
              value={filter.level}
              onChange={(e) => handleSelectChange('level', e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="All">All Levels</option>
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              id="filter-status"
              value={filter.status}
              onChange={(e) => handleSelectChange('status', e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Sort By selector */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              id="sort-ordering"
              value={filter.ordering}
              onChange={(e) => handleSelectChange('ordering', e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="-id">Recently Added</option>
              <option value="course_code">Course Code (A–Z)</option>
              <option value="course_name">Course Name (A–Z)</option>
              <option value="fee">Fee: Low to High</option>
              <option value="-fee">Fee: High to Low</option>
              <option value="duration">Duration: Short to Long</option>
              <option value="credits">Credits</option>
              <option value="start_date">Start Date</option>
            </select>
          </div>
        </div>

        {/* Clear Filters indicator */}
        {hasActiveFilters && (
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <span>Filters applied. Displaying matching courses.</span>
            </div>
            <button
              id="btn-clear-filters"
              onClick={onClearFilters}
              className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Course Display: Table or Cards */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center text-slate-500">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium">Loading courses from SQLite database...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No courses found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
            {hasActiveFilters
              ? 'No courses matched your search and filter criteria. Try adjusting your query or resetting filters.'
              : 'The course database is currently empty. Add your first course curriculum now.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {hasActiveFilters ? (
              <button
                onClick={onClearFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={onNavigateAdd}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
              >
                Add First Course
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* Responsive Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Course Name</th>
                  <th className="py-3.5 px-4">Instructor</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4 text-center">Credits</th>
                  <th className="py-3.5 px-4 text-right">Fee</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* Course Code */}
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600 text-xs">
                      {c.course_code}
                    </td>

                    {/* Course Name */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1" title={c.course_name}>
                        {c.course_name}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                        {c.description}
                      </div>
                    </td>

                    {/* Instructor */}
                    <td className="py-3 px-4 text-xs font-medium text-slate-700 whitespace-nowrap">
                      {c.instructor}
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4 text-xs text-slate-600 whitespace-nowrap">
                      {c.department}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {c.category}
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-4 text-xs text-slate-700 whitespace-nowrap">
                      {c.duration} {c.duration_unit}
                    </td>

                    {/* Credits */}
                    <td className="py-3 px-4 text-xs text-center font-semibold text-slate-800">
                      {c.credits}
                    </td>

                    {/* Fee */}
                    <td className="py-3 px-4 text-xs text-right font-semibold text-slate-900 whitespace-nowrap">
                      ₹{Number(c.fee).toLocaleString()}
                    </td>

                    {/* Level */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium border ${getLevelBadge(c.level)}`}>
                        {c.level}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${getStatusBadge(c.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
                        {c.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          id={`btn-view-${c.id}`}
                          onClick={() => onViewCourse(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="View Course Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-edit-${c.id}`}
                          onClick={() => onEditCourse(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Edit Course"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-delete-${c.id}`}
                          onClick={() => onDeleteCourse(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Responsive Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5">
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {c.course_code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${getLevelBadge(c.level)}`}>
                      {c.level}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${getStatusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </div>
                </div>

                {/* Course Title & Department */}
                <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1" title={c.course_name}>
                  {c.course_name}
                </h3>
                <p className="text-xs text-indigo-600 font-medium mt-0.5">
                  {c.department} • {c.category}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>

                {/* Metadata details grid */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.instructor}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.duration} {c.duration_unit}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.credits} Credits</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>₹{Number(c.fee).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {c.start_date}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onViewCourse(c)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => onEditCourse(c)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDeleteCourse(c)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
