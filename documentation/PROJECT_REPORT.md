# COURSE MANAGEMENT SYSTEM
## Full-Stack Web Application Development & Viva Voce Project Report
**Standard Operating Procedure (SOP) Compliant Project Submission**

---

### Candidate Declaration & Certificate
This is to certify that the project entitled **"Course Management System"** is a bonafide academic work developed in accordance with the Standard Operating Procedure for CRUD-Based Web Application Development. The system demonstrates end-to-end full-stack principles including database modeling, RESTful API architecture, client/server validation, comprehensive automated testing, and user-centered design.

---

## 1. Abstract
The Course Management System (CMS) is a modern full-stack web application designed for academic departments, university administrators, and educational institutions. It delivers a centralized platform to create, review, update, and manage curricula across various technical domains. Built using a decoupled architecture—combining a reactive React frontend with a high-performance REST API backend and an ACID-compliant SQLite relational database—the application guarantees strict data integrity, fast querying, and seamless user interaction.

---

## 2. Introduction & Problem Statement
### 2.1 Existing System
In many educational institutions, curriculum management is conducted using fragmented spreadsheets, paper-based forms, or static PDF documents. This traditional approach suffers from:
- **Lack of Centralization:** Inconsistent data stored across multiple departmental silos.
- **Human Error:** Duplication of course codes, scheduling collisions, negative tuition fees, or missing instructor records.
- **Poor Searchability:** Difficulty in instantly filtering courses by level, department, tuition fee, or status.
- **Zero Real-Time Validation:** Errors are only discovered during end-of-semester audits.

### 2.2 Proposed System
The proposed Course Management System resolves these challenges through:
- **Strict Data Validation:** Comprehensive client-side and server-side checks on all 16 curriculum parameters.
- **RESTful Architecture:** Clear, standardized endpoints following HTTP conventions (GET, POST, PUT, PATCH, DELETE).
- **Relational Persistence:** ACID transactions with primary key autoincrement and unique constraint enforcement on `course_code`.
- **Responsive User Interface:** Single-page application (SPA) with dual table/card view modes, live search, multi-attribute filtering, and status notifications.

---

## 3. Project Objectives & Scope
### 3.1 Objectives
1. Implement full CRUD (Create, Read, Update, Delete) functionality for course curricula.
2. Ensure strict uniqueness and validation of all academic fields (e.g. course codes, duration, credits, positive fees, date order).
3. Provide an intuitive, responsive dashboard presenting aggregate metrics (active courses, total seat capacity, average tuition fee).
4. Provide automated test verification for all predefined test cases (TC01 to TC15).
5. Generate a compliant Postman collection for backend verification.

### 3.2 Scope
- **Entities Managed:** Academic courses, syllabus descriptions, faculties, departments, enrollment capacities, schedules, and tuition fees.
- **Target Audience:** Academic registrars, department heads, faculty leads, and curriculum coordinators.

---

## 4. System Requirements Specification
### 4.1 Functional Requirements
- **FR01: Course Registration:** Authorized administrators can input course metadata via a validated form.
- **FR02: Catalog Browsing:** View all active courses in a responsive table or visual cards.
- **FR03: Detailed Inspection:** Open a dedicated modal/page displaying all 16 course attributes and timestamps.
- **FR04: Course Modification:** Edit any existing course with pre-populated form fields (supporting full PUT and partial PATCH).
- **FR05: Secure Deletion:** Delete courses after an explicit confirmation dialog to avoid accidental data loss.
- **FR06: Search & Filter:** Dynamic live search by name, code, or instructor, combined with multi-select filters for department, category, level, and status.
- **FR07: Reseed/Reset Database:** One-click restoration of sample academic courses for testing.

### 4.2 Non-Functional Requirements
- **Performance:** Sub-100ms API response time on standard queries.
- **Reliability:** Relational transactional integrity with SQLite foreign key and uniqueness guarantees.
- **Usability:** WCAG AA accessible contrast, responsive breakpoints (mobile, tablet, desktop).
- **Maintainability:** Modular TypeScript components, decoupled services layer, standard Django/Express patterns.

---

## 5. Technology Stack
| Layer | Technology | Justification |
|---|---|---|
| **Frontend Framework** | React 19 (TypeScript) | Reactive virtual DOM, component reusability, strict static typing |
| **Styling & Icons** | Tailwind CSS & Lucide React | Rapid, consistent UI design system with zero CSS bloat |
| **API Client** | Fetch API / Axios Service | Centralized error handling and typed response serialization |
| **Backend Architecture** | Django REST Framework & Express Node API | RESTful standards, route separation, robust HTTP status mapping |
| **Relational Database** | SQLite (`db.sqlite3`) | Zero-configuration, ACID transactions, portable storage |
| **Testing & Tooling** | In-Browser Test Suite & Postman Collection | Real-time automated verification of TC01–TC15 |

---

## 6. System Architecture & Data Flow
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
|  - Express / Django REST Framework Router                         |
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

## 7. Database Design & Entity-Relationship (ER) Schema
### Table: `courses`
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique system identifier |
| `course_code` | VARCHAR(20) | UNIQUE, NOT NULL | Code identifier (e.g. CS101) |
| `course_name` | VARCHAR(255) | NOT NULL | Full course title |
| `description` | TEXT | NOT NULL | Syllabus & prerequisites |
| `instructor` | VARCHAR(100) | NOT NULL | Faculty in charge |
| `department` | VARCHAR(100) | NOT NULL | Academic department |
| `category` | VARCHAR(100) | NOT NULL | Knowledge domain |
| `duration` | INTEGER | NOT NULL, > 0 | Numerical duration |
| `duration_unit` | VARCHAR(20) | NOT NULL | Weeks / Months / Hours |
| `credits` | INTEGER | NOT NULL, > 0 | Academic credits |
| `fee` | DECIMAL(10,2) | NOT NULL, >= 0 | Tuition fee in INR/USD |
| `level` | VARCHAR(20) | NOT NULL | Beginner/Intermediate/Advanced|
| `start_date` | DATE | NOT NULL | Course start date |
| `end_date` | DATE | NOT NULL | Course end date (>= start) |
| `max_students` | INTEGER | NOT NULL, > 0 | Maximum enrollment seats |
| `status` | VARCHAR(20) | NOT NULL | Upcoming/Active/Completed/Cancelled |
| `created_at` | DATETIME | NOT NULL | System record creation timestamp |
| `updated_at` | DATETIME | NOT NULL | System record modification timestamp |

---

## 8. REST API Documentation
### 8.1 Summary of Endpoints
- `GET /api/courses/` : Returns list of all courses. Supports query parameters `search`, `department`, `category`, `level`, `status`, `ordering`.
- `POST /api/courses/` : Accepts JSON payload, validates all fields, and returns `201 Created` with the newly assigned `id`.
- `GET /api/courses/:id/` : Returns complete details of course `:id` (`200 OK`) or `404 Not Found`.
- `PUT /api/courses/:id/` : Full update of course `:id`.
- `PATCH /api/courses/:id/` : Partial update of specific fields for course `:id`.
- `DELETE /api/courses/:id/` : Permanently removes course `:id` from database (`204 No Content`).
- `GET /api/stats/` : Aggregates count of total, active, upcoming, completed courses, total capacity, and average fee.
- `POST /api/reseed/` : Reinitializes the database with initial academic sample records.

---

## 9. Comprehensive Test Cases & Results (TC01 - TC15)
| Test ID | Test Scenario | Input Data | Expected Output | Status |
|---|---|---|---|---|
| **TC01** | Add Valid Course | Complete valid course payload | `201 Created`, record saved in DB | **PASS** |
| **TC02** | Submit Empty Form | `{}` (empty payload) | `400 Bad Request` with field error map | **PASS** |
| **TC03** | Duplicate Course Code | Existing `course_code: "CS101"` | `400 Bad Request`, unique error | **PASS** |
| **TC04** | Invalid Fee | `fee: -500.00` | `400 Bad Request`, negative fee error | **PASS** |
| **TC05** | Invalid Date Range | `start_date > end_date` | `400 Bad Request`, date range error | **PASS** |
| **TC06** | View All Courses | `GET /api/courses/` | `200 OK`, JSON array returned | **PASS** |
| **TC07** | View Single Course | `GET /api/courses/1/` | `200 OK`, correct course object returned | **PASS** |
| **TC08** | Update Course | `PATCH /api/courses/1/` with fee | `200 OK`, updated value persisted | **PASS** |
| **TC09** | Update Invalid ID | `PUT /api/courses/99999/` | `404 Not Found` with detail message | **PASS** |
| **TC10** | Delete Course | `DELETE /api/courses/:id/` | `204 No Content`, record purged | **PASS** |
| **TC11** | Delete Invalid ID | `DELETE /api/courses/99999/` | `404 Not Found` response | **PASS** |
| **TC12** | Search Course | `GET /api/courses/?search=Python` | Matching course subset returned | **PASS** |
| **TC13** | Filter Courses | Query by department & status | Exact filtered courses returned | **PASS** |
| **TC14** | Backend Health | `GET /api/health/` | `200 OK`, database active | **PASS** |
| **TC15** | Mobile Layout | Viewport breakpoint simulation | Responsive grid & menu adaptive | **PASS** |

---

## 10. Screenshot Captions & Visual Verification Guide
Refer to `screenshots/README.md` for full placeholder mappings:
1. **Dashboard Overview:** Displays executive summary cards (Total Courses, Active Courses, Total Capacity, Avg Fee) and recent courses table.
2. **Course Catalog (Table & Card View):** Illustrates the course browsing experience with search bar and filter dropdowns.
3. **Add Course Form:** Demonstrates field layout with required indicators, numerical limits, and date pickers.
4. **Validation Error States:** Shows inline error badges beside fields when invalid data is submitted.
5. **Course Details Modal:** Displays full academic syllabus, faculty information, credits, and schedule.
6. **Edit Course Form:** Shows existing course record loaded into input fields for immediate updating.
7. **Delete Confirmation Dialog:** Safety modal verifying course code and title before irreversible deletion.
8. **Automated Test Suite Runner:** Real-time test log displaying green PASS badges for TC01–TC15.
9. **Postman API Collection:** Execution of POST, GET, PUT, PATCH, DELETE in Postman.
10. **Database Table State:** Inspection of SQLite `courses` table rows.

---

## 11. Security Measures & Challenges Overcome
### 11.1 Security Implementation
- **Parameterized SQL Queries:** Prevents SQL injection attacks by escaping all user inputs.
- **Input Sanitization:** Strips HTML/script tags and trims whitespace from names, codes, and descriptions.
- **Strict Constraint Validation:** Enforces positive numerical limits and logical chronological date ranges.
- **CORS Configuration:** Explicitly configures permitted origins and header policies.

### 11.2 Key Challenges & Technical Solutions
1. **Challenge:** Handling both full (`PUT`) and partial (`PATCH`) updates without overwriting untouched fields.
   - *Solution:* Implemented dynamic SQL query generation in the backend that selectively updates only the provided keys when executing partial updates.
2. **Challenge:** Maintaining synchronization between the frontend validation logic and backend API validation.
   - *Solution:* Mirrored identical validation rules on both layers, returning structured field-level error objects (`{ field: [message] }`) so the client can map server errors directly onto form inputs.

---

## 12. Conclusion & References
The **Course Management System** successfully satisfies all requirements of the Standard Operating Procedure (SOP) for CRUD-Based Web Application Development. It provides an efficient, accessible, and resilient platform for educational organizations, backed by comprehensive test coverage and standardized API documentation.

### References
- Django REST Framework Documentation: https://www.django-rest-framework.org/
- React Documentation: https://react.dev/
- SQLite Documentation: https://www.sqlite.org/docs.html
- MDN Web Docs (HTTP Status Codes & REST): https://developer.mozilla.org/en-US/docs/Web/HTTP
