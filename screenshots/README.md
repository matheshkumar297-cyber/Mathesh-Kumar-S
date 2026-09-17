# Screenshots Guide & Evaluation Artifacts
## Course Management System

This directory documents the visual evidence and evaluation checkpoints required for project viva and submission.

---

### Screenshot 1: Administrative Dashboard
- **File Placeholder:** `screenshots/01_dashboard.png`
- **What is shown:** The main administrative landing view displaying four primary summary metric cards (Total Courses, Active Courses, Total Student Capacity, Average Tuition Fee), quick action buttons ("New Course", "Test Runner", "Documentation"), and a table of recently registered courses.
- **Why it is used:** Provides academic coordinators with an instant high-level overview of curriculum distribution and enrollment capacities without having to scan raw database tables.
- **What was learned:** Learned how to design high-contrast executive summary dashboards with responsive grid geometry and clean visual hierarchy.

---

### Screenshot 2: Course Catalog (Table View & Dual-Mode Toggle)
- **File Placeholder:** `screenshots/02_course_list_table.png`
- **What is shown:** The course catalog displaying all active records in a clean tabular view, featuring columns for Course Code, Title, Instructor, Department, Duration, Credits, Fee, Status, and Action buttons (View, Edit, Delete).
- **Why it is used:** Allows administrators to scan, compare, and sort large numbers of course offerings efficiently.
- **What was learned:** Learned how to structure tabular data with accessible font scales, monospaced identification tags, and color-coded status pills.

---

### Screenshot 3: Course Catalog (Visual Card View)
- **File Placeholder:** `screenshots/03_course_list_cards.png`
- **What is shown:** The alternative responsive card grid view displaying each course with its syllabus preview, instructor avatar, schedule, and fee badge.
- **Why it is used:** Gives users a visual, touch-friendly browsing experience suited for mobile and tablet devices.
- **What was learned:** Learned how to implement stateful view toggles (Table vs. Cards) preserving the active filter context.

---

### Screenshot 4: Add Course Form (Full Layout)
- **File Placeholder:** `screenshots/04_add_course_form.png`
- **What is shown:** The comprehensive course creation form divided into 4 logical sections: (1) Basic Course Identification, (2) Academic Faculty & Categorization, (3) Curriculum Structure, Fees & Capacity, and (4) Schedule, Level & Status, with Reset and Submit buttons.
- **Why it is used:** Collects all 16 required course parameters in a structured manner.
- **What was learned:** Learned how to partition complex multi-attribute forms into readable thematic sections with clear visual rhythm.

---

### Screenshot 5: Client-Side and Server-Side Validation Errors
- **File Placeholder:** `screenshots/05_validation_errors.png`
- **What is shown:** The form highlighting invalid inputs with red borders, light-rose background tints, and specific error messages (e.g. "Course code must be unique", "Fee cannot be negative", "End date cannot be before start date").
- **Why it is used:** Guides the user to correct erroneous entries immediately before committing bad data to the database.
- **What was learned:** Learned how to combine client-side form validation with backend HTTP 400 field-error response mapping.

---

### Screenshot 6: Course Details Modal
- **File Placeholder:** `screenshots/06_course_details_modal.png`
- **What is shown:** A modal overlay revealing complete information for a selected course, including syllabus text, credits, duration, capacity, tuition fee, dates, and database timestamps.
- **Why it is used:** Enables in-depth inspection of curriculum details without navigating away from the catalog.
- **What was learned:** Learned how to construct accessible backdrop modal dialogs with keyboard escape and focus containment.

---

### Screenshot 7: Edit Course Form (Pre-Populated)
- **File Placeholder:** `screenshots/07_edit_course_form.png`
- **What is shown:** The course editing screen with all existing values loaded into form controls, ready for modification.
- **Why it is used:** Enables rapid curriculum revisions (e.g. updating instructor, fee, or semester status).
- **What was learned:** Learned how to manage pre-populated form state and handle partial updates.

---

### Screenshot 8: Delete Confirmation Safety Modal
- **File Placeholder:** `screenshots/08_delete_confirmation.png`
- **What is shown:** A modal with warning iconography asking the administrator to confirm deletion of the specified course code and name before the record is purged.
- **Why it is used:** Prevents irreversible accidental deletion of course records.
- **What was learned:** Learned the importance of two-step confirmation flows for destructive database operations.

---

### Screenshot 9: Live Search Query Results
- **File Placeholder:** `screenshots/09_search_results.png`
- **What is shown:** The course list dynamically filtering in real time as the user types queries like "Python" or "AI", matching across course code, course title, and instructor name.
- **Why it is used:** Provides immediate retrieval of specific courses among large catalogs.
- **What was learned:** Learned how to implement responsive search filters connecting client state to SQL query parameters.

---

### Screenshot 10: Multi-Attribute Filter Results
- **File Placeholder:** `screenshots/10_filter_results.png`
- **What is shown:** The course list filtered simultaneously by Department ("Computer Science") and Status ("Upcoming"), showing the active filter count badge and a "Clear Filters" button.
- **Why it is used:** Allows academic coordinators to extract specific curriculum cohorts.
- **What was learned:** Learned how to compose multi-attribute filtering logic on both client and server layers.

---

### Screenshot 11: Automated Test Suite (TC01 - TC15 All Passed)
- **File Placeholder:** `screenshots/11_automated_test_runner.png`
- **What is shown:** The in-app Test Suite Runner displaying green PASS badges for all 15 test cases (TC01 to TC15), along with HTTP status codes, execution duration, and response payloads.
- **Why it is used:** Provides verifiable evidence of system reliability and conformance to the academic SOP specification.
- **What was learned:** Learned how to automate end-to-end integration testing against a live SQLite database.

---

### Screenshot 12: Postman POST /api/courses/ Request & 201 Response
- **File Placeholder:** `screenshots/12_postman_post_create.png`
- **What is shown:** Postman execution of `POST http://localhost:3000/api/courses/` with JSON payload, returning HTTP `201 Created` with the auto-generated course ID and timestamps.
- **Why it is used:** Validates the API contract independently of the frontend application.
- **What was learned:** Learned how to verify REST API request headers, body formatting, and HTTP status codes using Postman.

---

### Screenshot 13: Postman GET /api/courses/ Request & 200 Response
- **File Placeholder:** `screenshots/13_postman_get_list.png`
- **What is shown:** Postman execution of `GET http://localhost:3000/api/courses/`, returning an array of course JSON objects.
- **Why it is used:** Confirms correct JSON serialization and list retrieval.
- **What was learned:** Learned how to evaluate REST API response schemas and query parameters.

---

### Screenshot 14: Postman PUT/PATCH /api/courses/1/ Request & 200 Response
- **File Placeholder:** `screenshots/14_postman_patch_update.png`
- **What is shown:** Postman execution of `PATCH http://localhost:3000/api/courses/1/` with updated tuition fee and status, returning HTTP `200 OK`.
- **Why it is used:** Demonstrates partial update capabilities without overwriting untouched attributes.
- **What was learned:** Learned the distinction between idempotent full replacement (`PUT`) and partial modification (`PATCH`).

---

### Screenshot 15: Postman DELETE /api/courses/1/ Request & 204 Response
- **File Placeholder:** `screenshots/15_postman_delete.png`
- **What is shown:** Postman execution of `DELETE http://localhost:3000/api/courses/1/`, returning HTTP `204 No Content`, followed by a verification GET returning `404 Not Found`.
- **Why it is used:** Confirms permanent database record removal and proper HTTP status code handling.
- **What was learned:** Learned how to implement secure deletion with appropriate HTTP response codes.

---

### Screenshot 16: SQLite Database Records Inspection
- **File Placeholder:** `screenshots/16_sqlite_database_table.png`
- **What is shown:** Direct database inspection of the `courses` table in SQLite (`db.sqlite3`), showing all 16 columns populated with structured academic records.
- **Why it is used:** Demonstrates persistent transactional storage in the relational database.
- **What was learned:** Learned how SQLite manages primary keys, schema types, and unique constraints.
