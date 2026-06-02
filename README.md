# 🎓 University Management System

A modern full-stack application built for universities to manage students, teachers, courses, and administrative tasks.

## Tech Stack
- **Backend**: FastAPI (Python), PostgreSQL, SQLAlchemy, Alembic, JWT Auth
- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Vite, shadcn/ui base
- **Authentication**: JWT (Backend) with local storage

## Core Roles
- `admin` - Manage the entire system, users, and setup.
- `teacher` - Manage courses, grades, and attendance.
- `student` - Register for courses, view grades.

## Getting Started

### 💻 Local Development Setup

#### Prerequisites
- Python 3.11 or 3.12 (Python 3.14 may have package compatibility issues)
- Node.js 18+
- PostgreSQL 15+ (or SQLite for local development)

#### Backend Setup
1. Ensure PostgreSQL is running and create the database:
   ```sql
   CREATE DATABASE university_db;
   ```

2. Navigate to the backend folder:
   ```bash
   cd backend
   ```

3. Create a virtual environment and install requirements:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/Mac:
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   - The `.env` file is already created with default configuration
   - Update `DATABASE_URL` in `.env` to match your PostgreSQL credentials if needed

5. Apply database migrations:
   ```bash
   alembic revision --autogenerate -m "Initial migration"
   alembic upgrade head
   ```

6. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   - Backend API will be available at `http://localhost:8000`
   - API docs available at `http://localhost:8000/docs`

#### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - The `.env` file is already configured with `VITE_API_URL=http://localhost:8000/api/v1`

4. Start the development server:
   ```bash
   npm run dev
   ```
   - Frontend will be accessible at `http://localhost:5173`

## Default Admin Credentials
- **Email**: `admin@university.edu`
- **Password**: `Admin@123456`

## Project Structure
```
studentRegSystem/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Config, database, security
│   │   ├── crud/         # Database operations
│   │   ├── models/       # SQLAlchemy models
│   │   └── schemas/      # Pydantic schemas
│   ├── alembic/          # Database migrations
│   ├── .env              # Backend configuration
│   ├── requirements.txt  # Python dependencies
│   └── alembic.ini       # Alembic configuration
├── frontend/
│   ├── src/
│   │   ├── api/          # API calls (backend.ts)
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Auth context (JWT)
│   │   └── pages/        # Page components
│   │       ├── admin/     # Admin pages
│   │       ├── teacher/   # Teacher pages
│   │       └── student/   # Student pages
│   ├── .env              # Frontend configuration
│   └── package.json
└── README.md
```

## API Endpoints
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/students` - List students
- `POST /api/v1/students` - Create student
- `GET /api/v1/teachers` - List teachers
- `POST /api/v1/teachers` - Create teacher
- `GET /api/v1/courses` - List courses
- `POST /api/v1/courses` - Create course
- `GET /api/v1/departments` - List departments
- `POST /api/v1/departments` - Create department
- `GET /api/v1/enrollments` - List enrollments
- `POST /api/v1/enrollments` - Create enrollment
- `GET /api/v1/stats/admin` - Admin dashboard stats

## Features

### Admin Dashboard
- View system statistics (students, courses, teachers, departments)
- Manage students, teachers, courses, and departments
- View enrollment analytics and course distribution
- Monitor recent system activities

### Teacher Dashboard
- Manage assigned courses
- Track student attendance
- Submit and manage grades
- View teaching schedule

### Student Dashboard
- View enrolled courses
- Check grades and GPA
- View attendance records
- Browse available courses for enrollment

## License
MIT License
