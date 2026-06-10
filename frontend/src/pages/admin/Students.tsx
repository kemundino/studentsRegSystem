import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, BookOpen, Trash } from 'lucide-react';
import { getStudents, deleteStudent, createStudent, updateStudent, register, getCourses, getEnrollments, createEnrollment, deleteEnrollment } from '../../api/backend';

export const Students = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Enrollment Modal states
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [studentEnrollments, setStudentEnrollments] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsData, coursesData] = await Promise.all([
        getStudents(),
        getCourses()
      ]);
      setStudents(studentsData);
      setCourses(coursesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const handleDelete = async (studentId: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(studentId);
        fetchStudents();
      } catch (error) {
        console.error('Failed to delete student:', error);
      }
    }
  };

  const openCreateModal = () => {
    setModalType('create');
    setError('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setStudentId('');
    setDateOfBirth('');
    setPhone('');
    setAddress('');
    setIsModalOpen(true);
  };

  const openEditModal = (student: any) => {
    setModalType('edit');
    setSelectedStudent(student);
    setError('');
    setFirstName(student.user?.first_name || '');
    setLastName(student.user?.last_name || '');
    setEmail(student.user?.email || '');
    setPassword('');
    setStudentId(student.student_id || '');
    setDateOfBirth(student.date_of_birth ? student.date_of_birth.substring(0, 10) : '');
    setPhone(student.phone || '');
    setAddress(student.address || '');
    setIsModalOpen(true);
  };

  // Enrollment management
  const openEnrollmentModal = async (student: any) => {
    setSelectedStudent(student);
    setIsEnrollmentModalOpen(true);
    setLoadingEnrollments(true);
    setSelectedCourseId('');
    try {
      const enrolls = await getEnrollments({ student_id: student.id });
      setStudentEnrollments(enrolls);
    } catch (err) {
      console.error('Failed to fetch enrollments:', err);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !selectedStudent) return;

    try {
      await createEnrollment({
        student_id: selectedStudent.id,
        course_id: Number(selectedCourseId),
        status: 'approved' // admins enroll directly
      });
      setSelectedCourseId('');
      // refresh
      const enrolls = await getEnrollments({ student_id: selectedStudent.id });
      setStudentEnrollments(enrolls);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to enroll student.');
    }
  };

  const handleUnenroll = async (enrollmentId: string) => {
    if (!confirm('Are you sure you want to remove this student from this course?')) return;
    try {
      await deleteEnrollment(enrollmentId);
      const enrolls = await getEnrollments({ student_id: selectedStudent.id });
      setStudentEnrollments(enrolls);
    } catch (err) {
      console.error('Failed to delete enrollment:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (modalType === 'create') {
        const userResult = await register({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          role: 'student',
          is_verified: true // Students don't need verification flow by default
        });

        await createStudent({
          user_id: userResult.id,
          student_id: studentId,
          date_of_birth: dateOfBirth ? dateOfBirth : null,
          phone: phone || null,
          address: address || null,
        });
      } else {
        await updateStudent(selectedStudent.id, {
          date_of_birth: dateOfBirth ? dateOfBirth : null,
          phone: phone || null,
          address: address || null,
        });
      }

      setIsModalOpen(false);
      fetchStudents();
    } catch (err: any) {
      console.error(err);
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map((d: any) => d.msg).join(', '));
      } else {
        setError('An error occurred. Please check your inputs.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">Students</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage student records and course enrollments.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-medium text-sm"
        >
          <Plus size={18} />
          <span>Add Student</span>
        </button>
      </div>

      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex gap-4 items-center transition-colors">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search students by ID, name, or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-slate-800 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 min-w-[800px]">
              <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-white/5 border-b border-slate-200 dark:border-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{student.student_id}</td>
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-300">{student.user?.first_name} {student.user?.last_name}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{student.user?.email}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{student.phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">{student.address || 'N/A'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEnrollmentModal(student)}
                            title="Manage Enrollments"
                            className="p-2 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <BookOpen size={16} />
                            <span className="text-xs font-semibold hidden md:inline">Courses</span>
                          </button>
                          <button 
                            onClick={() => openEditModal(student)}
                            title="Edit Student Info"
                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(student.id)}
                            title="Delete Student"
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-8" style={{ animation: 'scaleUp 0.2s ease-out' }}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {modalType === 'create' ? 'Add New Student' : 'Edit Student Details'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 dark:text-slate-455 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {modalType === 'create' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              )}

              {modalType === 'create' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.doe@university.edu"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Password</label>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Student ID</label>
                  <input 
                    type="text" 
                    required
                    disabled={modalType === 'edit'}
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="STD-2025-001"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Home Address</label>
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Academic Way, University Town"
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/15 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
                >
                  {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {modalType === 'create' ? 'Add Student' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enrollment Management Modal */}
      {isEnrollmentModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-8" style={{ animation: 'scaleUp 0.2s ease-out' }}>
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Course Enrollments</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Student: {selectedStudent.user?.first_name} {selectedStudent.user?.last_name}</p>
              </div>
              <button 
                onClick={() => setIsEnrollmentModalOpen(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Add Enrollment Form */}
              <form onSubmit={handleEnroll} className="flex flex-col sm:flex-row gap-3">
                <select
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-violet-500"
                >
                  <option value="">Choose Course to Enroll...</option>
                  {courses.map((course) => {
                    const alreadyEnrolled = studentEnrollments.some(e => e.course_id === course.id);
                    return (
                      <option key={course.id} value={course.id} disabled={alreadyEnrolled} className="bg-white dark:bg-slate-900">
                        {course.code} - {course.name} {alreadyEnrolled ? '(Already Enrolled)' : ''}
                      </option>
                    );
                  })}
                </select>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                >
                  <Plus size={16} />
                  <span>Enroll</span>
                </button>
              </form>

              {/* Current Enrollments List */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enrolled Courses</h3>
                
                {loadingEnrollments ? (
                  <div className="flex items-center justify-center py-4">
                    <LoaderSpinner size="small" />
                  </div>
                ) : studentEnrollments.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/5 rounded-xl">
                    Not enrolled in any courses yet.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {studentEnrollments.map((enrollment) => {
                      const courseName = enrollment.course?.name || courses.find(c => c.id === enrollment.course_id)?.name || 'Unknown Course';
                      const courseCode = enrollment.course?.code || courses.find(c => c.id === enrollment.course_id)?.code || 'N/A';
                      return (
                        <div key={enrollment.id} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-150 dark:border-white/5 rounded-xl">
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{courseCode}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{courseName}</p>
                          </div>
                          <button
                            onClick={() => handleUnenroll(enrollment.id)}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Unenroll"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple helper loading indicator
const LoaderSpinner = ({ size = 'medium' }: { size?: 'small' | 'medium' }) => (
  <div className={`border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin ${size === 'small' ? 'w-5 h-5' : 'w-8 h-8'}`} />
);
