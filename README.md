# Course Management System (CMS)
A full-stack, responsive web application for managing academic courses, curricula, faculties, and enrollment capacities with complete CRUD capabilities, strict multi-attribute validation, automated integration test suite, and SQLite database persistence.

Developed strictly following the **Standard Operating Procedure (SOP) for CRUD-Based Web Application Development**.

---

## 📖 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Folder Structure](#folder-structure)
6. [Prerequisites](#prerequisites)
7. [Installation & Setup](#installation--setup)
   - [Unified Live Environment](#unified-live-environment)
   - [Django Backend Setup (Standalone Option)](#django-backend-setup-standalone-option)
   - [Frontend React Setup (Standalone Option)](#frontend-react-setup-standalone-option)
8. [Database Schema & Migrations](#database-schema--migrations)
9. [REST API Documentation](#rest-api-documentation)
10. [Automated Testing Suite (TC01 - TC15)](#automated-testing-suite-tc01---tc15)
11. [Postman API Collection](#postman-api-collection)
12. [Screenshots & Visual Evidence](#screenshots--visual-evidence)
13. [Academic Documentation & Viva Voce](#academic-documentation--viva-voce)

---

## 1. Project Overview
The **Course Management System** addresses the limitations of fragmented spreadsheets and paper forms in academic institutions. It provides an intuitive, high-contrast, responsive interface for academic administrators, registrars, and faculty heads to:
- **Add** new courses with 16 comprehensive parameters and instant validation.
- **View** courses in dual display modes (detailed data table or visual card grid).
- **Inspect** deep curriculum metadata, faculty information, schedules, and timestamps in a modal.
- **Edit & Update** course offerings with pre-populated forms, supporting both full (`PUT`) and partial (`PATCH`) updates.
- **Delete** obsolete courses safely with two-step confirmation dialogs.
- **Search & Filter** dynamically across course codes, names, faculties, departments, categories, levels, and statuses.

---

## 2. Key Features
- **Full CRUD Support:** Complete implementation of Create, Read, Update, and Delete operations.
- **Strict Two-Layer Validation:** Enforces course code uniqueness, non-empty text, positive numbers for duration, credits, and capacity, non-negative fees, and chronological date sequences (`end_date >= start_date`).
- **Interactive Executive Dashboard:** Metrics displaying Total Courses, Active Curricula, Total Enrollment Seats, and Average Tuition Fees.
- **Dual Display Modes:** Instant toggle between high-density data table and responsive bento cards.
- **Automated In-App Test Runner:** One-click automated verification of all 15 predefined test scenarios (TC01 to TC15) with live timing and status badges.
- **Embedded Project Report:** Complete viva voce documentation, architecture diagrams, ER schemas, and evaluation questions accessible directly in the app.
- **Downloadable Postman Collection:** Ready-to-import Postman collection with sample payloads and expected response schemas.

---

## 3. Technology Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React icons
- **Backend:** Express & Django REST Framework (Python 3.10+ / Node.js runtime)
- **Database:** SQLite (`db.sqlite3`), relational ACID transactions, auto-incrementing primary keys
- **API Protocol:** RESTful JSON over HTTP (GET, POST, PUT, PATCH, DELETE)
- **Testing:** Built-in Automated Test Runner & Postman Collection v2.1

---

## 4. System Architecture
```
+-------------------------------------------------------------------+
|                        Client Layer (Browser)                    |
|  - React 19 SPA (Dashboard, CourseList, CourseForm, Modals)       |
|  - Client-Side Form Validator & State Store                      |
+---------------------------------+---------------------------------+
                                  |
                   HTTP JSON REST API Requests
                   (GET, POST, PUT, PATCH, DELETE)
                                  |
+---------------------------------v---------------------------------+
|                       Server Layer (Backend)                      |
|  - REST API Router (Express / Django REST Framework)             |
|  - Serializer & Server-Side Validator Layer                       |
|  - Business Logic & Error Formatting (400, 404, 500)             |
+---------------------------------+---------------------------------+
                                  |
                           SQL Queries
                                  |
+---------------------------------v---------------------------------+
|                      Database Layer (SQLite)                      |
|  - Table: courses (16 Columns, PRIMARY KEY, UNIQUE course_code)  |
|  - Transactional ACID Persistence                                 |
+-------------------------------------------------------------------+
```

---

## 5. Folder Structure
```
course-management-system/
├── backend/                         # Django REST Framework Backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── course_management/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── courses/
│       ├── admin.py
│       ├── apps.py
│       ├── models.py
│       ├── serializers.py
│       ├── urls.py
│       ├── views.py
│       ├── tests.py
│       └── migrations/
│           └── 0001_initial.py
├── src/                             # React 19 Frontend
│   ├── components/
│   │   ├── Header.tsx               # Top navigation bar
│   │   ├── Sidebar.tsx              # Adaptive sidebar navigation
│   │   ├── Dashboard.tsx            # Executive stats & metrics
│   │   ├── CourseList.tsx           # Search, filters, table & card view
│   │   ├── CourseForm.tsx           # Add / Edit form with validation
│   │   ├── CourseDetailsModal.tsx   # Detailed inspection modal
│   │   ├── DeleteConfirmationModal.tsx # Safe deletion dialog
│   │   ├── ApiTestRunner.tsx        # TC01-TC15 automated test runner
│   │   ├── DocumentationModal.tsx   # In-app academic project report
│   │   └── Toast.tsx                # Notifications system
│   ├── services/
│   │   └── api.ts                   # Centralized API service layer
│   ├── types.ts                     # TypeScript shared interfaces & types
│   ├── App.tsx                      # Root application component
│   ├── main.tsx                     # React entry point
│   └── index.css                    # Tailwind CSS configuration
├── documentation/
│   └── PROJECT_REPORT.md            # Comprehensive academic project report
├── screenshots/
│   └── README.md                    # Screenshot captions & viva guide
├── server.ts                        # Unified full-stack server & SQLite engine
├── Course_Management_System.postman_collection.json # Postman export
├── metadata.json                    # Application metadata
├── package.json                     # Dependencies and scripts
└── README.md                        # Documentation
```

---

## 6. Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Python 3.10+ (optional for standalone Django backend execution)

---

## 7. Installation & Setup

### Unified Live Environment (Recommended)
The project is configured as a full-stack container application serving both the REST API and the React frontend on port 3000.

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the application:**
   ```bash
   npm run dev
   ```
3. **Open the application:**
   Navigate to `http://localhost:3000` in your web browser.

---

### Django Backend Setup (Standalone Option)
If you wish to run the standalone Django REST Framework backend:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
5. Start the development server:
   ```bash
   python manage.py runserver 8000
   ```
6. Access the Django Browsable API at `http://localhost:8000/api/courses/` or the Admin panel at `http://localhost:8000/admin/`.

---

## 8. Database Schema & Fields
The `courses` relational table includes 16 attributes:
- `id`: Integer PRIMARY KEY AUTOINCREMENT
- `course_code`: String UNIQUE (e.g. `CS101`)
- `course_name`: String (e.g. `Introduction to Python`)
- `description`: Text (Syllabus and objectives)
- `instructor`: String (e.g. `Dr. Kumar`)
- `department`: String (e.g. `Computer Science`)
- `category`: String (e.g. `Computer Science`)
- `duration`: Positive Integer (e.g. `12`)
- `duration_unit`: String (`Hours`, `Days`, `Weeks`, `Months`)
- `credits`: Positive Integer (e.g. `4`)
- `fee`: Non-negative Decimal (e.g. `5000.00`)
- `level`: String (`Beginner`, `Intermediate`, `Advanced`)
- `start_date`: Date (`YYYY-MM-DD`)
- `end_date`: Date (`YYYY-MM-DD`, `>= start_date`)
- `max_students`: Positive Integer (e.g. `40`)
- `status`: String (`Upcoming`, `Active`, `Completed`, `Cancelled`)
- `created_at`: ISO DateTime
- `updated_at`: ISO DateTime

---

## 9. REST API Documentation
| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| **GET** | `/api/courses/` | List all courses with search, filters & ordering | `200 OK` |
| **POST** | `/api/courses/` | Create a new course with validation | `201 Created` / `400 Bad Request` |
| **GET** | `/api/courses/:id/` | Retrieve single course details | `200 OK` / `404 Not Found` |
| **PUT** | `/api/courses/:id/` | Full update of existing course | `200 OK` / `400 Bad Request` |
| **PATCH**| `/api/courses/:id/` | Partial update of specific fields | `200 OK` / `400 Bad Request` |
| **DELETE**| `/api/courses/:id/` | Delete course permanently | `204 No Content` / `404 Not Found` |
| **GET** | `/api/stats/` | Aggregated dashboard metrics | `200 OK` |
| **POST**| `/api/reseed/` | Reseed SQLite database with sample records | `200 OK` |
| **GET** | `/api/health/` | Service health status check | `200 OK` |

---

## 10. Automated Testing Suite (TC01 - TC15)
The application includes an in-app interactive test harness to run all 15 required test scenarios against the live SQLite backend:
- **TC01:** Add Valid Course → HTTP 201 Created
- **TC02:** Submit Empty Form → HTTP 400 Bad Request (Field errors returned)
- **TC03:** Duplicate Course Code → HTTP 400 Bad Request (Unique violation error)
- **TC04:** Invalid Fee (Negative) → HTTP 400 Bad Request (Fee validation error)
- **TC05:** Invalid Date Range → HTTP 400 Bad Request (Date sequence error)
- **TC06:** View All Courses → HTTP 200 OK (Array of courses returned)
- **TC07:** View Single Course → HTTP 200 OK (Detailed object matching ID)
- **TC08:** Update Course → HTTP 200 OK (Updated values persisted)
- **TC09:** Update Invalid ID → HTTP 404 Not Found
- **TC10:** Delete Course → HTTP 204 No Content (Record removed)
- **TC11:** Delete Invalid ID → HTTP 404 Not Found
- **TC12:** Search Course Query → HTTP 200 OK (Query matches returned)
- **TC13:** Filter Courses → HTTP 200 OK (Department/Category filtered subset)
- **TC14:** Backend Availability → HTTP 200 OK (SQLite connection confirmed)
- **TC15:** Mobile Responsiveness → CSS Viewport and breakpoint verification

Click **"API Test Suite"** in the sidebar to execute all tests automatically.

---

## 11. Postman API Collection
The complete Postman collection is provided in `Course_Management_System.postman_collection.json`.
It includes:
- POST `/api/courses/` (Create course with sample JSON body)
- GET `/api/courses/` (List all courses)
- GET `/api/courses/1/` (Get single course by ID)
- PUT `/api/courses/1/` (Full update)
- PATCH `/api/courses/1/` (Partial update)
- DELETE `/api/courses/1/` (Delete course)

You can download it directly from the application's Test Suite view or import the JSON file into Postman.

---

## 12. Academic Documentation & Viva Voce
Full academic documentation is available in:
- `documentation/PROJECT_REPORT.md`: Comprehensive 12-section report including Abstract, Problem Statement, System Architecture, ER Diagram, API Spec, Validation Rules, Test Matrix, and Security Measures.
- `screenshots/README.md`: Descriptions and educational captions for all 16 required screenshots.
- In-App Report: Click **"Documentation"** in the top navigation bar or sidebar to view the report and viva questions directly inside the application.
