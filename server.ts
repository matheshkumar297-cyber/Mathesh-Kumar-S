import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { DatabaseSync } from 'node:sqlite';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize SQLite database
const dbFilePath = path.join(process.cwd(), 'db.sqlite3');
const db = new DatabaseSync(dbFilePath);

// Initialize Courses Table
db.exec(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT NOT NULL UNIQUE,
    course_name TEXT NOT NULL,
    description TEXT NOT NULL,
    instructor TEXT NOT NULL,
    department TEXT NOT NULL,
    category TEXT NOT NULL,
    duration INTEGER NOT NULL,
    duration_unit TEXT NOT NULL,
    credits INTEGER NOT NULL,
    fee REAL NOT NULL,
    level TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    max_students INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

// Seed initial courses if table is empty
const countStmt = db.prepare('SELECT COUNT(*) as count FROM courses');
const courseCountResult = countStmt.get() as { count: number };

const SAMPLE_COURSES = [
  {
    course_code: 'CS101',
    course_name: 'Introduction to Python',
    description: 'Fundamentals of Python programming including variables, flow control, object-oriented concepts, and standard data analysis modules.',
    instructor: 'Dr. Kumar',
    department: 'Computer Science',
    category: 'Computer Science',
    duration: 12,
    duration_unit: 'Weeks',
    credits: 4,
    fee: 5000,
    level: 'Beginner',
    start_date: '2026-10-01',
    end_date: '2026-12-24',
    max_students: 40,
    status: 'Upcoming'
  },
  {
    course_code: 'CS201',
    course_name: 'Web Development',
    description: 'Full-stack web application development utilizing modern React components, RESTful API architecture, state management, and SQLite database storage.',
    instructor: 'Prof. Sarah Jenkins',
    department: 'Computer Science',
    category: 'Information Technology',
    duration: 10,
    duration_unit: 'Weeks',
    credits: 3,
    fee: 6500,
    level: 'Intermediate',
    start_date: '2026-09-01',
    end_date: '2026-11-15',
    max_students: 35,
    status: 'Active'
  },
  {
    course_code: 'AI301',
    course_name: 'Artificial Intelligence',
    description: 'Core concepts in artificial intelligence, heuristic search algorithms, probability theory, perceptrons, and neural network foundations.',
    instructor: 'Dr. Rajesh Sharma',
    department: 'Computer Science',
    category: 'Artificial Intelligence',
    duration: 14,
    duration_unit: 'Weeks',
    credits: 4,
    fee: 8000,
    level: 'Advanced',
    start_date: '2026-08-15',
    end_date: '2026-11-30',
    max_students: 30,
    status: 'Active'
  },
  {
    course_code: 'DS401',
    course_name: 'Data Science',
    description: 'Data acquisition, feature cleaning, exploratory data analysis, statistical regression, decision trees, and interactive data visualization.',
    instructor: 'Dr. Ananya Iyer',
    department: 'Information Technology',
    category: 'Data Science',
    duration: 12,
    duration_unit: 'Weeks',
    credits: 4,
    fee: 7500,
    level: 'Intermediate',
    start_date: '2026-06-01',
    end_date: '2026-08-31',
    max_students: 45,
    status: 'Completed'
  },
  {
    course_code: 'CY501',
    course_name: 'Cyber Security Fundamentals',
    description: 'Essential network security frameworks, cryptography fundamentals, offensive penetration testing principles, and defensive threat mitigations.',
    instructor: 'Prof. Michael Vance',
    department: 'Information Technology',
    category: 'Cyber Security',
    duration: 8,
    duration_unit: 'Weeks',
    credits: 3,
    fee: 5500,
    level: 'Beginner',
    start_date: '2026-11-01',
    end_date: '2026-12-30',
    max_students: 50,
    status: 'Upcoming'
  }
];

function seedDatabase(force = false) {
  if (force) {
    db.exec('DELETE FROM courses;');
  }
  const insertStmt = db.prepare(`
    INSERT INTO courses (
      course_code, course_name, description, instructor, department,
      category, duration, duration_unit, credits, fee, level,
      start_date, end_date, max_students, status, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
  `);

  const now = new Date().toISOString();
  for (const c of SAMPLE_COURSES) {
    insertStmt.run(
      c.course_code,
      c.course_name,
      c.description,
      c.instructor,
      c.department,
      c.category,
      c.duration,
      c.duration_unit,
      c.credits,
      c.fee,
      c.level,
      c.start_date,
      c.end_date,
      c.max_students,
      c.status,
      now,
      now
    );
  }
}

if (courseCountResult.count === 0) {
  seedDatabase(false);
}

// Server-side validation logic
const VALID_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const VALID_STATUSES = ['Upcoming', 'Active', 'Completed', 'Cancelled'];

function validateCourseData(data: Record<string, any>, currentId: number | null = null, isPatch = false) {
  const errors: Record<string, string[]> = {};

  const checkRequired = (field: string, label: string) => {
    if (!isPatch || field in data) {
      if (data[field] === undefined || data[field] === null || String(data[field]).trim() === '') {
        errors[field] = [`${label} cannot be empty.`];
      }
    }
  };

  checkRequired('course_code', 'Course code');
  checkRequired('course_name', 'Course name');
  checkRequired('description', 'Description');
  checkRequired('instructor', 'Instructor');
  checkRequired('department', 'Department');
  checkRequired('category', 'Category');
  checkRequired('duration_unit', 'Duration unit');
  checkRequired('level', 'Level');
  checkRequired('status', 'Status');
  checkRequired('start_date', 'Start date');
  checkRequired('end_date', 'End date');

  // Validate course_code uniqueness
  if (data.course_code && String(data.course_code).trim() !== '') {
    const code = String(data.course_code).trim().toUpperCase();
    let existingQuery = 'SELECT id FROM courses WHERE UPPER(course_code) = ?';
    let params: any[] = [code];
    if (currentId !== null) {
      existingQuery += ' AND id != ?';
      params.push(currentId);
    }
    const existing = db.prepare(existingQuery).get(...params);
    if (existing) {
      errors.course_code = ['Course with this course code already exists. Course code must be unique.'];
    }
  }

  // Numerical validation: duration
  if (!isPatch || 'duration' in data) {
    const dur = Number(data.duration);
    if (isNaN(dur) || dur <= 0 || !Number.isInteger(dur)) {
      errors.duration = ['Duration must be an integer greater than 0.'];
    }
  }

  // Numerical validation: credits
  if (!isPatch || 'credits' in data) {
    const cred = Number(data.credits);
    if (isNaN(cred) || cred <= 0 || !Number.isInteger(cred)) {
      errors.credits = ['Credits must be an integer greater than 0.'];
    }
  }

  // Numerical validation: fee
  if (!isPatch || 'fee' in data) {
    const fee = Number(data.fee);
    if (isNaN(fee) || fee < 0) {
      errors.fee = ['Fee cannot be negative.'];
    }
  }

  // Numerical validation: max_students
  if (!isPatch || 'max_students' in data) {
    const maxS = Number(data.max_students);
    if (isNaN(maxS) || maxS <= 0 || !Number.isInteger(maxS)) {
      errors.max_students = ['Maximum students must be an integer greater than 0.'];
    }
  }

  // Validate level
  if (data.level && !VALID_LEVELS.includes(data.level)) {
    errors.level = [`Level must be one of: ${VALID_LEVELS.join(', ')}.`];
  }

  // Validate status
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.status = [`Status must be one of: ${VALID_STATUSES.join(', ')}.`];
  }

  // Date validation: start_date vs end_date
  let startDate = data.start_date;
  let endDate = data.end_date;

  if (isPatch && currentId !== null) {
    const existingCourse = db.prepare('SELECT start_date, end_date FROM courses WHERE id = ?').get(currentId) as any;
    if (existingCourse) {
      startDate = startDate || existingCourse.start_date;
      endDate = endDate || existingCourse.end_date;
    }
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime())) {
      errors.start_date = ['Start date is not a valid date.'];
    }
    if (isNaN(end.getTime())) {
      errors.end_date = ['End date is not a valid date.'];
    }
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
      errors.end_date = ['End date cannot be before start date.'];
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// ---------------- REST API ROUTES ----------------

// GET /api/health/
app.get('/api/health/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Course Management System REST API',
    database: 'SQLite (db.sqlite3)',
    timestamp: new Date().toISOString()
  });
});

// GET /api/stats/
app.get('/api/stats/', (req: Request, res: Response) => {
  try {
    const total = (db.prepare('SELECT COUNT(*) as c FROM courses').get() as any).c;
    const active = (db.prepare("SELECT COUNT(*) as c FROM courses WHERE status = 'Active'").get() as any).c;
    const upcoming = (db.prepare("SELECT COUNT(*) as c FROM courses WHERE status = 'Upcoming'").get() as any).c;
    const completed = (db.prepare("SELECT COUNT(*) as c FROM courses WHERE status = 'Completed'").get() as any).c;
    const cancelled = (db.prepare("SELECT COUNT(*) as c FROM courses WHERE status = 'Cancelled'").get() as any).c;
    const totalStudents = (db.prepare('SELECT SUM(max_students) as s FROM courses').get() as any).s || 0;
    const avgFee = (db.prepare('SELECT AVG(fee) as a FROM courses').get() as any).a || 0;

    const departmentBreakdown = db.prepare('SELECT department, COUNT(*) as count FROM courses GROUP BY department').all();
    const categoryBreakdown = db.prepare('SELECT category, COUNT(*) as count FROM courses GROUP BY category').all();

    res.json({
      total_courses: total,
      active_courses: active,
      upcoming_courses: upcoming,
      completed_courses: completed,
      cancelled_courses: cancelled,
      total_capacity: totalStudents,
      average_fee: Math.round(avgFee * 100) / 100,
      department_breakdown: departmentBreakdown,
      category_breakdown: categoryBreakdown
    });
  } catch (error: any) {
    res.status(500).json({ detail: 'Error computing statistics', error: error.message });
  }
});

// POST /api/courses/seed/ - Reset / Seed Database
app.post('/api/courses/seed/', (req: Request, res: Response) => {
  try {
    seedDatabase(true);
    const count = (db.prepare('SELECT COUNT(*) as c FROM courses').get() as any).c;
    res.json({ message: 'Database reseeded successfully', count });
  } catch (error: any) {
    res.status(500).json({ detail: 'Failed to reseed database', error: error.message });
  }
});

// GET /api/courses/
app.get('/api/courses/', (req: Request, res: Response) => {
  try {
    const { search, department, category, level, status, ordering } = req.query;

    let query = 'SELECT * FROM courses WHERE 1=1';
    const params: any[] = [];

    if (search && String(search).trim() !== '') {
      const term = `%${String(search).trim()}%`;
      query += ` AND (
        course_name LIKE ? OR
        course_code LIKE ? OR
        instructor LIKE ? OR
        department LIKE ? OR
        category LIKE ?
      )`;
      params.push(term, term, term, term, term);
    }

    if (department && department !== 'All') {
      query += ' AND department = ?';
      params.push(department);
    }

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (level && level !== 'All') {
      query += ' AND level = ?';
      params.push(level);
    }

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    // Ordering
    const validOrderingFields: Record<string, string> = {
      course_code: 'course_code ASC',
      '-course_code': 'course_code DESC',
      course_name: 'course_name ASC',
      '-course_name': 'course_name DESC',
      fee: 'fee ASC',
      '-fee': 'fee DESC',
      duration: 'duration ASC',
      '-duration': 'duration DESC',
      credits: 'credits ASC',
      '-credits': 'credits DESC',
      created_at: 'created_at ASC',
      '-created_at': 'created_at DESC',
      start_date: 'start_date ASC',
      '-start_date': 'start_date DESC'
    };

    if (ordering && validOrderingFields[String(ordering)]) {
      query += ` ORDER BY ${validOrderingFields[String(ordering)]}`;
    } else {
      query += ' ORDER BY id DESC';
    }

    const courses = db.prepare(query).all(...params);
    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ detail: 'Failed to retrieve courses', error: error.message });
  }
});

// GET /api/courses/:id/
app.get('/api/courses/:id/', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ detail: 'Course not found.' });
    }

    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
    if (!course) {
      return res.status(404).json({ detail: 'Course not found.' });
    }

    res.json(course);
  } catch (error: any) {
    res.status(500).json({ detail: 'Database error occurred', error: error.message });
  }
});

// POST /api/courses/
app.post('/api/courses/', (req: Request, res: Response) => {
  try {
    const validation = validateCourseData(req.body, null, false);
    if (!validation.isValid) {
      return res.status(400).json(validation.errors);
    }

    const now = new Date().toISOString();
    const insertStmt = db.prepare(`
      INSERT INTO courses (
        course_code, course_name, description, instructor, department,
        category, duration, duration_unit, credits, fee, level,
        start_date, end_date, max_students, status, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?
      )
    `);

    const result = insertStmt.run(
      String(req.body.course_code).trim().toUpperCase(),
      String(req.body.course_name).trim(),
      String(req.body.description).trim(),
      String(req.body.instructor).trim(),
      String(req.body.department).trim(),
      String(req.body.category).trim(),
      parseInt(req.body.duration, 10),
      String(req.body.duration_unit).trim(),
      parseInt(req.body.credits, 10),
      parseFloat(req.body.fee),
      String(req.body.level).trim(),
      String(req.body.start_date).trim(),
      String(req.body.end_date).trim(),
      parseInt(req.body.max_students, 10),
      String(req.body.status).trim(),
      now,
      now
    );

    const newCourseId = Number(result.lastInsertRowid);
    const newCourse = db.prepare('SELECT * FROM courses WHERE id = ?').get(newCourseId);

    res.status(201).json(newCourse);
  } catch (error: any) {
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        course_code: ['Course with this course code already exists. Course code must be unique.']
      });
    }
    res.status(500).json({ detail: 'Failed to create course', error: error.message });
  }
});

// PUT /api/courses/:id/
app.put('/api/courses/:id/', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ detail: 'Course not found.' });
    }

    const existing = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ detail: 'Course not found.' });
    }

    const validation = validateCourseData(req.body, id, false);
    if (!validation.isValid) {
      return res.status(400).json(validation.errors);
    }

    const now = new Date().toISOString();
    const updateStmt = db.prepare(`
      UPDATE courses SET
        course_code = ?,
        course_name = ?,
        description = ?,
        instructor = ?,
        department = ?,
        category = ?,
        duration = ?,
        duration_unit = ?,
        credits = ?,
        fee = ?,
        level = ?,
        start_date = ?,
        end_date = ?,
        max_students = ?,
        status = ?,
        updated_at = ?
      WHERE id = ?
    `);

    updateStmt.run(
      String(req.body.course_code).trim().toUpperCase(),
      String(req.body.course_name).trim(),
      String(req.body.description).trim(),
      String(req.body.instructor).trim(),
      String(req.body.department).trim(),
      String(req.body.category).trim(),
      parseInt(req.body.duration, 10),
      String(req.body.duration_unit).trim(),
      parseInt(req.body.credits, 10),
      parseFloat(req.body.fee),
      String(req.body.level).trim(),
      String(req.body.start_date).trim(),
      String(req.body.end_date).trim(),
      parseInt(req.body.max_students, 10),
      String(req.body.status).trim(),
      now,
      id
    );

    const updatedCourse = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
    res.status(200).json(updatedCourse);
  } catch (error: any) {
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        course_code: ['Course with this course code already exists. Course code must be unique.']
      });
    }
    res.status(500).json({ detail: 'Failed to update course', error: error.message });
  }
});

// PATCH /api/courses/:id/
app.patch('/api/courses/:id/', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ detail: 'Course not found.' });
    }

    const existing = db.prepare('SELECT * FROM courses WHERE id = ?').get(id) as any;
    if (!existing) {
      return res.status(404).json({ detail: 'Course not found.' });
    }

    const validation = validateCourseData(req.body, id, true);
    if (!validation.isValid) {
      return res.status(400).json(validation.errors);
    }

    const allowedFields = [
      'course_code', 'course_name', 'description', 'instructor', 'department',
      'category', 'duration', 'duration_unit', 'credits', 'fee', 'level',
      'start_date', 'end_date', 'max_students', 'status'
    ];

    const updates: string[] = [];
    const params: any[] = [];

    for (const field of allowedFields) {
      if (field in req.body) {
        updates.push(`${field} = ?`);
        let val = req.body[field];
        if (field === 'course_code') val = String(val).trim().toUpperCase();
        else if (['duration', 'credits', 'max_students'].includes(field)) val = parseInt(val, 10);
        else if (field === 'fee') val = parseFloat(val);
        else if (typeof val === 'string') val = val.trim();
        params.push(val);
      }
    }

    if (updates.length > 0) {
      const now = new Date().toISOString();
      updates.push('updated_at = ?');
      params.push(now);

      params.push(id);
      const query = `UPDATE courses SET ${updates.join(', ')} WHERE id = ?`;
      db.prepare(query).run(...params);
    }

    const updatedCourse = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
    res.status(200).json(updatedCourse);
  } catch (error: any) {
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        course_code: ['Course with this course code already exists. Course code must be unique.']
      });
    }
    res.status(500).json({ detail: 'Failed to partially update course', error: error.message });
  }
});

// DELETE /api/courses/:id/
app.delete('/api/courses/:id/', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ detail: 'Course not found.' });
    }

    const existing = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ detail: 'Course not found.' });
    }

    db.prepare('DELETE FROM courses WHERE id = ?').run(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ detail: 'Failed to delete course', error: error.message });
  }
});

// GET /api/postman/
app.get('/api/postman/', (req: Request, res: Response) => {
  const collection = {
    info: {
      name: 'Course Management System API Collection',
      description: 'REST API endpoints for Course Management System CRUD operations matching Django REST Framework specifications.',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    item: [
      {
        name: 'List All Courses',
        request: {
          method: 'GET',
          url: '{{baseUrl}}/api/courses/',
          description: 'Fetch all courses with optional filters (search, department, category, level, status)'
        }
      },
      {
        name: 'Get Course by ID',
        request: {
          method: 'GET',
          url: '{{baseUrl}}/api/courses/1/',
          description: 'Retrieve details of single course'
        }
      },
      {
        name: 'Create Course',
        request: {
          method: 'POST',
          url: '{{baseUrl}}/api/courses/',
          header: [{ key: 'Content-Type', value: 'application/json' }],
          body: {
            mode: 'raw',
            raw: JSON.stringify(SAMPLE_COURSES[0], null, 2)
          },
          description: 'Create a new course with server-side validation'
        }
      },
      {
        name: 'Update Course (PUT)',
        request: {
          method: 'PUT',
          url: '{{baseUrl}}/api/courses/1/',
          header: [{ key: 'Content-Type', value: 'application/json' }],
          body: {
            mode: 'raw',
            raw: JSON.stringify({ ...SAMPLE_COURSES[0], course_name: 'Advanced Python Programming', fee: 5500 }, null, 2)
          },
          description: 'Full update of an existing course'
        }
      },
      {
        name: 'Partial Update Course (PATCH)',
        request: {
          method: 'PATCH',
          url: '{{baseUrl}}/api/courses/1/',
          header: [{ key: 'Content-Type', value: 'application/json' }],
          body: {
            mode: 'raw',
            raw: JSON.stringify({ fee: 5200, status: 'Active' }, null, 2)
          },
          description: 'Partial update of course fields'
        }
      },
      {
        name: 'Delete Course',
        request: {
          method: 'DELETE',
          url: '{{baseUrl}}/api/courses/1/',
          description: 'Remove course by ID'
        }
      },
      {
        name: 'Get Statistics',
        request: {
          method: 'GET',
          url: '{{baseUrl}}/api/stats/',
          description: 'Get dashboard summary metrics and distributions'
        }
      }
    ]
  };
  res.json(collection);
});

// Vite middleware & Production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
