import api from './axios';

export const login = async (email: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);
  
  const response = await api.post('/auth/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const register = async (userData: any) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Admin Stats
export const getAdminStats = async () => {
  const response = await api.get('/stats/admin');
  return response.data;
};

// Students
export const getStudents = async (params?: any) => {
  const response = await api.get('/students', { params });
  return response.data;
};

export const createStudent = async (studentData: any) => {
  const response = await api.post('/students', studentData);
  return response.data;
};

export const updateStudent = async (studentId: string, studentData: any) => {
  const response = await api.put(`/students/${studentId}`, studentData);
  return response.data;
};

export const deleteStudent = async (studentId: string) => {
  const response = await api.delete(`/students/${studentId}`);
  return response.data;
};

// Teachers
export const getTeachers = async (params?: any) => {
  const response = await api.get('/teachers', { params });
  return response.data;
};

export const createTeacher = async (teacherData: any) => {
  const response = await api.post('/teachers', teacherData);
  return response.data;
};

export const updateTeacher = async (teacherId: string, teacherData: any) => {
  const response = await api.put(`/teachers/${teacherId}`, teacherData);
  return response.data;
};

export const deleteTeacher = async (teacherId: string) => {
  const response = await api.delete(`/teachers/${teacherId}`);
  return response.data;
};

// Courses
export const getCourses = async (params?: any) => {
  const response = await api.get('/courses', { params });
  return response.data;
};

export const createCourse = async (courseData: any) => {
  const response = await api.post('/courses', courseData);
  return response.data;
};

export const updateCourse = async (courseId: string, courseData: any) => {
  const response = await api.put(`/courses/${courseId}`, courseData);
  return response.data;
};

export const deleteCourse = async (courseId: string) => {
  const response = await api.delete(`/courses/${courseId}`);
  return response.data;
};

// Departments
export const getDepartments = async (params?: any) => {
  const response = await api.get('/departments', { params });
  return response.data;
};

export const createDepartment = async (departmentData: any) => {
  const response = await api.post('/departments', departmentData);
  return response.data;
};

export const updateDepartment = async (departmentId: string, departmentData: any) => {
  const response = await api.put(`/departments/${departmentId}`, departmentData);
  return response.data;
};

export const deleteDepartment = async (departmentId: string) => {
  const response = await api.delete(`/departments/${departmentId}`);
  return response.data;
};

// Grades
export const getGrades = async (params?: any) => {
  const response = await api.get('/grades', { params });
  return response.data;
};

export const createGrade = async (gradeData: any) => {
  const response = await api.post('/grades', gradeData);
  return response.data;
};

export const updateGrade = async (gradeId: string, gradeData: any) => {
  const response = await api.put(`/grades/${gradeId}`, gradeData);
  return response.data;
};

// Attendance
export const getAttendance = async (params?: any) => {
  const response = await api.get('/attendance', { params });
  return response.data;
};

export const createAttendance = async (attendanceData: any) => {
  const response = await api.post('/attendance', attendanceData);
  return response.data;
};

export const updateAttendance = async (attendanceId: string, attendanceData: any) => {
  const response = await api.put(`/attendance/${attendanceId}`, attendanceData);
  return response.data;
};

// Enrollments
export const getEnrollments = async (params?: any) => {
  const response = await api.get('/enrollments', { params });
  return response.data;
};

export const createEnrollment = async (enrollmentData: any) => {
  const response = await api.post('/enrollments', enrollmentData);
  return response.data;
};

export const approveEnrollment = async (enrollmentId: string) => {
  const response = await api.put(`/enrollments/${enrollmentId}/approve`);
  return response.data;
};

// Higher-level helpers used by dashboards
const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

export const getStudentStats = async (studentId: string) => {
  try {
    const [gradesData, enrollmentsData, attendanceData] = await Promise.all([
      getGrades({ student_id: studentId }),
      getEnrollments({ student_id: studentId }),
      getAttendance({ student_id: studentId }),
    ]);

    const gradeValues = Array.isArray(gradesData) ? gradesData.map((g: any) => Number(g.value ?? g.grade ?? 0)).filter((n) => !Number.isNaN(n)) : [];
    const gpa = avg(gradeValues);

    const courses = Array.isArray(enrollmentsData) ? enrollmentsData.length : 0;

    let credits = 0;
    if (Array.isArray(enrollmentsData)) {
      credits = enrollmentsData.reduce((sum: number, e: any) => {
        const c = Number(e.credits ?? e.course?.credits ?? 0);
        return sum + (Number.isFinite(c) ? c : 0);
      }, 0);
    }

    let attendancePercent = 0;
    if (Array.isArray(attendanceData) && attendanceData.length) {
      const presentCount = attendanceData.reduce((s: number, a: any) => s + (a.present ? 1 : 0), 0);
      attendancePercent = Math.round((presentCount / attendanceData.length) * 100);
    }

    return {
      gpa: Number(gpa.toFixed(2)),
      credits: Math.round(credits),
      courses,
      attendance: attendancePercent,
    };
  } catch (err) {
    console.warn('getStudentStats failed:', err);
    return { gpa: 0.0, credits: 0, courses: 0, attendance: 0 };
  }
};

export const getTeacherStats = async (teacherId: string) => {
  try {
    const [coursesData, enrollmentsData, gradesData] = await Promise.all([
      getCourses({ teacher_id: teacherId }),
      getEnrollments({ teacher_id: teacherId }),
      getGrades({ teacher_id: teacherId }),
    ]);

    const courses = Array.isArray(coursesData) ? coursesData.length : 0;

    const studentsSet = new Set<string>();
    if (Array.isArray(enrollmentsData)) {
      enrollmentsData.forEach((e: any) => {
        if (e.student_id) studentsSet.add(String(e.student_id));
        if (e.student?.id) studentsSet.add(String(e.student.id));
      });
    }

    let pendingGrades = 0;
    if (Array.isArray(gradesData)) {
      pendingGrades = gradesData.reduce((s: number, g: any) => s + ((g.status === 'pending' || g.value == null) ? 1 : 0), 0);
    }

    let attendancePercent = 0;
    const attendanceRecords: any[] = [];
    if (Array.isArray(enrollmentsData)) {
      enrollmentsData.forEach((e: any) => {
        if (Array.isArray(e.attendance)) attendanceRecords.push(...e.attendance);
      });
    }
    if (attendanceRecords.length) {
      const presentCount = attendanceRecords.reduce((s: number, a: any) => s + (a.present ? 1 : 0), 0);
      attendancePercent = Math.round((presentCount / attendanceRecords.length) * 100);
    }

    return {
      courses,
      students: studentsSet.size,
      attendance: attendancePercent,
      pendingGrades,
    };
  } catch (err) {
    console.warn('getTeacherStats failed:', err);
    return { courses: 0, students: 0, attendance: 0, pendingGrades: 0 };
  }
};

export const updateEnrollment = async (enrollmentId: string, enrollmentData: any) => {
  const response = await api.put(`/enrollments/${enrollmentId}`, enrollmentData);
  return response.data;
};

export const verifyEmail = async (email: string) => {
  const response = await api.post(`/auth/verify?email=${encodeURIComponent(email)}`);
  return response.data;
};

export const deleteEnrollment = async (enrollmentId: string) => {
  const response = await api.delete(`/enrollments/${enrollmentId}`);
  return response.data;
};
