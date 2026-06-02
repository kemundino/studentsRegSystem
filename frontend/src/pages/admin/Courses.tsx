import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import { getCourses, deleteCourse, createCourse, updateCourse, getTeachers, getDepartments } from '../../api/backend';

export const Courses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState<number>(3);
  const [description, setDescription] = useState('');
  const [teacherId, setTeacherId] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesData, teachersData, departmentsData] = await Promise.all([
        getCourses(),
        getTeachers(),
        getDepartments()
      ]);
      setCourses(coursesData);
      setTeachers(teachersData);
      setDepartments(departmentsData);
    } catch (error) {
      console.error('Failed to fetch courses data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId);
        fetchData();
      } catch (error) {
        console.error('Failed to delete course:', error);
      }
    }
  };

  const openCreateModal = () => {
    setModalType('create');
    setError('');
    setCode('');
    setName('');
    setCredits(3);
    setDescription('');
    setTeacherId('');
    setDepartmentId('');
    setStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (course: any) => {
    setModalType('edit');
    setSelectedCourse(course);
    setError('');
    setCode(course.code || '');
    setName(course.name || '');
    setCredits(course.credits ?? 3);
    setDescription(course.description || '');
    setTeacherId(course.teacher_id ? String(course.teacher_id) : '');
    setDepartmentId(course.department_id ? String(course.department_id) : '');
    setStatus(course.status || 'active');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      code,
      name,
      credits: Number(credits),
      description: description || null,
      teacher_id: teacherId ? Number(teacherId) : null,
      department_id: departmentId ? Number(departmentId) : null,
      status
    };

    try {
      if (modalType === 'create') {
        await createCourse(payload);
      } else {
        await updateCourse(selectedCourse.id, payload);
      }
      setIsModalOpen(false);
      fetchData();
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

  const filteredCourses = courses.filter(course =>
    course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.department?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">Courses</h1>
          <p className="text-slate-400 text-sm mt-1">Manage academic courses and assignments.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-medium text-sm"
        >
          <Plus size={18} />
          <span>Add Course</span>
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search courses by code, name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-slate-300 placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 min-w-[700px]">
              <thead className="bg-white/5 text-slate-400 font-medium">
                <tr>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Credits</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Instructor</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      No courses found
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => {
                    const deptName = departments.find(d => d.id === course.department_id)?.name || 'N/A';
                    const instructor = teachers.find(t => t.id === course.teacher_id);
                    const instructorName = instructor ? `${instructor.user?.first_name} ${instructor.user?.last_name}` : 'N/A';
                    return (
                      <tr key={course.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 border-t border-white/10 font-medium text-white">{course.code}</td>
                        <td className="px-6 py-4 border-t border-white/10">{course.name}</td>
                        <td className="px-6 py-4 border-t border-white/10">{course.credits}</td>
                        <td className="px-6 py-4 border-t border-white/10">{deptName}</td>
                        <td className="px-6 py-4 border-t border-white/10">{instructorName}</td>
                        <td className="px-6 py-4 border-t border-white/10">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${course.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                            {course.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 border-t border-white/10 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => openEditModal(course)}
                              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(course.id)}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
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

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-8" style={{ animation: 'scaleUp 0.2s ease-out' }}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {modalType === 'create' ? 'Add New Course' : 'Edit Course Details'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Course Code</label>
                  <input 
                    type="text" 
                    required
                    disabled={modalType === 'edit'}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CS-101"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Credits</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    max={10}
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Course Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Introduction to Programming"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Department</label>
                  <select 
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id} className="bg-slate-900">{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Instructor</label>
                  <select 
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value="">Select Instructor</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id} className="bg-slate-900">
                        {t.user?.first_name} {t.user?.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a brief course description..."
                    rows={3}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/15 text-slate-300 hover:bg-white/5 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
                >
                  {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {modalType === 'create' ? 'Add Course' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
