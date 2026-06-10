import React, { useState, useEffect } from 'react';
import { Search, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getTeachers, getCourses, getEnrollments, updateEnrollment } from '../../api/backend';

export const TeacherGradebook = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  
  // State for modified grades
  const [grades, setGrades] = useState<{ [enrollmentId: string]: number }>({});

  useEffect(() => {
    fetchInitialData();
  }, [user]);

  const fetchInitialData = async () => {
    if (!user) return;
    try {
      // 1. Find the teacher profile that belongs to the current user
      const teachersList = await getTeachers();
      const currentTeacher = teachersList.find((t: any) => t.user_id === user.id);
      
      if (currentTeacher) {
        // 2. Fetch courses for this teacher
        const coursesList = await getCourses({ teacher_id: currentTeacher.id });
        setCourses(coursesList);
        if (coursesList.length > 0) {
          setSelectedCourseId(String(coursesList[0].id));
        }
      }
    } catch (error) {
      console.error('Failed to load initial gradebook data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourseId) {
      fetchCourseEnrollments();
    } else {
      setEnrollments([]);
    }
  }, [selectedCourseId]);

  const fetchCourseEnrollments = async () => {
    setLoadingEnrollments(true);
    try {
      const enrolls = await getEnrollments({ course_id: Number(selectedCourseId) });
      setEnrollments(enrolls);
      
      // Initialize grades state
      const initialGrades: { [enrollmentId: string]: number } = {};
      enrolls.forEach((e: any) => {
        initialGrades[e.id] = e.grade ?? 0;
      });
      setGrades(initialGrades);
    } catch (error) {
      console.error('Failed to load enrollments:', error);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleGradeChange = (enrollmentId: string, value: string) => {
    const num = Math.min(100, Math.max(0, Number(value) || 0));
    setGrades(prev => ({
      ...prev,
      [enrollmentId]: num
    }));
  };

  const handleSaveGrade = async (enrollmentId: string) => {
    const score = grades[enrollmentId];
    setSavingId(enrollmentId);
    try {
      await updateEnrollment(enrollmentId, {
        grade: score,
        status: 'approved'
      });
      // Refresh
      await fetchCourseEnrollments();
    } catch (err) {
      console.error('Failed to update grade:', err);
      alert('Failed to save grade.');
    } finally {
      setSavingId(null);
    }
  };

  const getLetterGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const filteredEnrollments = enrollments.filter(e =>
    e.student?.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.student?.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.student?.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">Teacher Gradebook</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Submit academic scores and final letter grades for your classes.</p>
        </div>
        
        <div className="w-full sm:w-auto flex gap-4">
          <select 
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500"
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id} className="bg-white dark:bg-slate-900">
                {course.code} - {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search students in course..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-slate-800 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {loadingEnrollments ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 min-w-[700px]">
              <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Score (0-100)</th>
                  <th className="px-6 py-4">Final Grade</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No enrolled students found in this course.
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map(enrollment => {
                    const score = grades[enrollment.id] ?? 0;
                    return (
                      <tr key={enrollment.id} className="hover:bg-slate-50 dark:hover:bg-white/5 border-b border-slate-200 dark:border-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">{enrollment.student?.student_id}</td>
                        <td className="px-6 py-4 text-slate-800 dark:text-slate-350">{enrollment.student?.user?.first_name} {enrollment.student?.user?.last_name}</td>
                        <td className="px-6 py-4">
                          <input 
                            type="number" 
                            min={0}
                            max={100}
                            value={score}
                            onChange={(e) => handleGradeChange(enrollment.id, e.target.value)}
                            className="w-20 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-violet-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                            score >= 85 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                            score >= 70 ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' :
                            score >= 60 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          }`}>
                            {getLetterGrade(score)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {score >= 60 ? (
                            <div className="flex items-center text-emerald-500 text-xs font-medium">
                              <CheckCircle size={14} className="mr-1" />
                              <span>Passing</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-rose-500 text-xs font-medium">
                              <AlertCircle size={14} className="mr-1" />
                              <span>Failing</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleSaveGrade(enrollment.id)}
                            disabled={savingId === enrollment.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                          >
                            {savingId === enrollment.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Save size={14} />
                            )}
                            <span>Save</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
