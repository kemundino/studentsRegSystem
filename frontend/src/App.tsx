import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/auth/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { Students } from './pages/admin/Students';
import { Faculty } from './pages/admin/Faculty';
import { Courses as AdminCourses } from './pages/admin/Courses';
import { Departments } from './pages/admin/Departments';
import { Settings } from './pages/admin/Settings';

import { TeacherDashboard } from './pages/teacher/Dashboard';
import { TeacherMyCourses as TeacherCourses } from './pages/teacher/MyCourses';
import { TeacherSchedule } from './pages/teacher/Schedule';
import { TeacherGradebook as Gradebook } from './pages/teacher/Gradebook';

import { StudentDashboard } from './pages/student/Dashboard';
import { StudentMyCourses as StudentCourses } from './pages/student/MyCourses';
import { StudentSchedule } from './pages/student/Schedule';
import { StudentGrades as Grades } from './pages/student/Grades';

import { NotFound } from './pages/NotFound';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#0a0e1a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-600 dark:text-slate-400 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} replace /> : <Login />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to={user ? `/${user.role}` : "/login"} replace />} />

        {/* Admin Routes */}
        <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/students" element={<ProtectedRoute allowedRoles={['admin']}><Students /></ProtectedRoute>} />
        <Route path="admin/faculty" element={<ProtectedRoute allowedRoles={['admin']}><Faculty /></ProtectedRoute>} />
        <Route path="admin/courses" element={<ProtectedRoute allowedRoles={['admin']}><AdminCourses /></ProtectedRoute>} />
        <Route path="admin/departments" element={<ProtectedRoute allowedRoles={['admin']}><Departments /></ProtectedRoute>} />
        <Route path="admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />

        {/* Teacher Routes */}
        <Route path="teacher" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
        <Route path="teacher/courses" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherCourses /></ProtectedRoute>} />
        <Route path="teacher/schedule" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSchedule /></ProtectedRoute>} />
        <Route path="teacher/grades" element={<ProtectedRoute allowedRoles={['teacher']}><Gradebook /></ProtectedRoute>} />

        {/* Student Routes */}
        <Route path="student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="student/courses" element={<ProtectedRoute allowedRoles={['student']}><StudentCourses /></ProtectedRoute>} />
        <Route path="student/schedule" element={<ProtectedRoute allowedRoles={['student']}><StudentSchedule /></ProtectedRoute>} />
        <Route path="student/grades" element={<ProtectedRoute allowedRoles={['student']}><Grades /></ProtectedRoute>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
