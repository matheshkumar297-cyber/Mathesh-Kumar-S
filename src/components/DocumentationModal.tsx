import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  CheckCircle2, 
  Layers, 
  Database, 
  Code2, 
  BookOpen, 
  ExternalLink,
  Cpu,
  ShieldCheck,
  Check
} from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'report' | 'architecture' | 'api' | 'viva'>('report');
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadReport = () => {
    const reportText = `# Course Management System - Project Report & SOP Documentation
Author: Engineering Candidate
Date: 2026

## 1. Abstract
The Course Management System is a full-stack, enterprise-grade web application engineered to manage higher education curricula. Built following standard academic CRUD guidelines, it integrates a responsive React frontend with a secure RESTful API backend and transactional SQLite database persistence.

## 2. Main Course Entity Schema
- id: Integer PRIMARY KEY AUTOINCREMENT
- course_code: String (Unique, Required, e.g. CS101)
- course_name: String (Required)
- description: Text (Required)
- instructor: String (Required)
- department: String (Required)
- category: String (Required)
- duration: Integer (Required, > 0)
- duration_unit: String (Required: Weeks/Months/Hours)
- credits: Integer (Required, > 0)
- fee: Real / Decimal (Required, >= 0)
- level: String (Required: Beginner/Intermediate/Advanced)
- start_date: Date (Required)
- end_date: Date (Required, >= start_date)
- max_students: Integer (Required, > 0)
- status: String (Required: Upcoming/Active/Completed/Cancelled)
- created_at: DateTime
- updated_at: DateTime

## 3. REST API Endpoints
- GET /api/courses/ : List & filter courses
- GET /api/courses/{id}/ : Retrieve single course details
- POST /api/courses/ : Create course with server validation
- PUT /api/courses/{id}/ : Full course update
- PATCH /api/courses/{id}/ : Partial course update
- DELETE /api/courses/{id}/ : Delete course
- GET /api/stats/ : Aggregated statistics

## 4. Test Cases TC01-TC15
All test cases (TC01 to TC15) have been verified with automated test suites covering positive, negative, edge cases, and client-server validation.
`;
    const blob = new Blob([reportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Course_Management_System_Project_Report.md';
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs transition-opacity">
      <div 
        id="modal-documentation-report"
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Academic Project Report & Viva Evaluation
              </h3>
              <p className="text-xs text-slate-500">
                Course Management System • Full-Stack CRUD SOP Specification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadReport}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1.5 transition-colors"
            >
              {downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloaded ? 'Downloaded!' : 'Download Report (.md)'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-5 gap-4 bg-white text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('report')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'report' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Full Project Report</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'architecture' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture & ER Diagram</span>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'api' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>REST API Spec</span>
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'viva' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Viva Questions & Answers</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          {activeTab === 'report' && (
            <div className="space-y-6">
              {/* Executive Summary */}
              <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">
                  1. Abstract & Objectives
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The <strong>Course Management System</strong> provides higher education faculties and academic administrators with a centralized web portal to organize, track, validate, and publish curriculum data. The system enforces strict integrity on course codes, dates, and capacities while providing full Create, Read, Update, and Delete (CRUD) operations.
                </p>
              </section>

              {/* Functional Requirements */}
              <section>
                <h4 className="text-sm font-bold text-slate-900 mb-2">
                  2. Functional Requirements Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Create new courses with multi-attribute validation</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>View all courses in responsive table and card layouts</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Search courses by name, code, faculty, or department</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Filter courses by Department, Category, Level, and Status</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Edit course metadata with pre-populated form state</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Delete courses with confirmation safety dialog</span>
                  </div>
                </div>
              </section>

              {/* Validation Rules */}
              <section>
                <h4 className="text-sm font-bold text-slate-900 mb-2">
                  3. Client-Side and Server-Side Validation Rules
                </h4>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <p><strong>Course Code:</strong> Required, non-empty, and globally unique across catalog (e.g. CS101).</p>
                  <p><strong>Course Name & Description:</strong> Required, non-empty text strings.</p>
                  <p><strong>Instructor & Department:</strong> Required valid faculty assignment.</p>
                  <p><strong>Category & Level:</strong> Constrained dropdown selections (Beginner, Intermediate, Advanced).</p>
                  <p><strong>Duration & Credits:</strong> Strictly positive integers (&gt; 0).</p>
                  <p><strong>Tuition Fee:</strong> Non-negative numeric value (&gt;= 0).</p>
                  <p><strong>Date Validity:</strong> Start date required; End date must be on or after start date.</p>
                  <p><strong>Student Capacity:</strong> Greater than 0 integer.</p>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Architecture diagram */}
              <div className="p-5 bg-slate-900 text-white rounded-2xl font-mono text-xs space-y-3">
                <div className="text-indigo-400 font-bold">SYSTEM ARCHITECTURE DATA FLOW</div>
                <div className="p-3 bg-slate-800 rounded-lg text-slate-300">
                  User Browser (React 19 SPA)
                  <br />↓ [HTTP GET / POST / PUT / PATCH / DELETE]
                  <br />REST API Router & Serialization Layer
                  <br />↓ [Validation & Error Formatting]
                  <br />SQLite Database Engine (`db.sqlite3` / Table: `courses`)
                </div>
              </div>

              {/* ER Diagram Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">
                  Entity-Relationship (ER) Schema Specification
                </h4>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs space-y-1">
                  <div><strong>Table:</strong> courses</div>
                  <div>• id: INTEGER PRIMARY KEY AUTOINCREMENT</div>
                  <div>• course_code: VARCHAR(20) UNIQUE NOT NULL</div>
                  <div>• course_name: VARCHAR(255) NOT NULL</div>
                  <div>• description: TEXT NOT NULL</div>
                  <div>• instructor: VARCHAR(100) NOT NULL</div>
                  <div>• department: VARCHAR(100) NOT NULL</div>
                  <div>• category: VARCHAR(100) NOT NULL</div>
                  <div>• duration: INTEGER NOT NULL</div>
                  <div>• duration_unit: VARCHAR(20) NOT NULL</div>
                  <div>• credits: INTEGER NOT NULL</div>
                  <div>• fee: DECIMAL(10,2) NOT NULL</div>
                  <div>• level: VARCHAR(20) NOT NULL</div>
                  <div>• start_date: DATE NOT NULL</div>
                  <div>• end_date: DATE NOT NULL</div>
                  <div>• max_students: INTEGER NOT NULL</div>
                  <div>• status: VARCHAR(20) NOT NULL</div>
                  <div>• created_at: DATETIME NOT NULL</div>
                  <div>• updated_at: DATETIME NOT NULL</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                REST API Specification (Standard HTTP Verbs)
              </h4>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-600">GET /api/courses/</span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">200 OK</span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    Retrieve all courses. Supports query parameters: <code>search</code>, <code>department</code>, <code>category</code>, <code>level</code>, <code>status</code>, <code>ordering</code>.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-600">POST /api/courses/</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">201 Created</span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    Create a new course. Validates all 15 rules and checks uniqueness. Returns created object with timestamps.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-600">GET /api/courses/:id/</span>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">200 / 404</span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    Fetch single course by ID. Returns 404 Not Found if ID does not exist.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-600">PUT /api/courses/:id/</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">200 / 400</span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    Full replacement update for course entity.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-600">PATCH /api/courses/:id/</span>
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">200 / 400</span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    Partial update for specific fields (e.g. fee, status, instructor).
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-rose-600">DELETE /api/courses/:id/</span>
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold">204 No Content</span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    Permanently delete course record by ID from SQLite database.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'viva' && (
            <div className="space-y-4 text-xs">
              <h4 className="text-sm font-bold text-slate-900">
                Viva Voce Frequent Evaluation Questions & Answers
              </h4>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">Q1: How is data consistency and uniqueness of course code maintained?</p>
                <p className="text-slate-600 leading-relaxed">
                  Both at the client form layer (via instantaneous duplicate detection against loaded course state) and at the backend API layer (via SQL query check and database UNIQUE constraint on `course_code`).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">Q2: Why is SQLite suitable here, and how can it migrate to PostgreSQL/MySQL?</p>
                <p className="text-slate-600 leading-relaxed">
                  SQLite provides lightweight, self-contained ACID transactions with zero configuration. Because the Django models and ORM/SQL statements use standard SQL data types, switching to PostgreSQL or MySQL simply requires altering the database engine configuration in settings.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">Q3: How does the application handle partial updates versus full updates?</p>
                <p className="text-slate-600 leading-relaxed">
                  PUT requires all required fields to be validated and submitted, updating the full record. PATCH only requires the modified fields, validating them independently while preserving existing properties.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
