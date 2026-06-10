import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, CheckCircle, Mail, AlertCircle, Copy, Check } from 'lucide-react';
import { getTeachers, deleteTeacher, createTeacher, updateTeacher, register, getDepartments } from '../../api/backend';

export const Teacher = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Link copy simulation state
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [copied, setCopied] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [departmentId, setDepartmentId] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teachersData, departmentsData] = await Promise.all([
        getTeachers(),
        getDepartments()
      ]);
      setTeachers(teachersData);
      setDepartments(departmentsData);
    } catch (error) {
      console.error('Failed to fetch teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (teacherId: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      try {
        await deleteTeacher(teacherId);
        fetchData();
      } catch (error) {
        console.error('Failed to delete teacher:', error);
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
    setTeacherId('');
    setSpecialization('');
    setDepartmentId('');
    setIsModalOpen(true);
  };

  const openEditModal = (teacher: any) => {
    setModalType('edit');
    setSelectedTeacher(teacher);
    setError('');
    setFirstName(teacher.user?.first_name || '');
    setLastName(teacher.user?.last_name || '');
    setEmail(teacher.user?.email || '');
    setPassword('');
    setTeacherId(teacher.teacher_id || '');
    setSpecialization(teacher.specialization || '');
    setDepartmentId(teacher.department_id ? String(teacher.department_id) : '');
    setIsModalOpen(true);
  };

  const openVerificationModal = (teacherEmail: string) => {
    setVerificationEmail(teacherEmail);
    setVerificationModalOpen(true);
    setCopied(false);
  };

  const getVerificationUrl = () => {
    const origin = window.location.origin;
    return `${origin}/verify?email=${encodeURIComponent(verificationEmail)}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getVerificationUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const parsedDeptId = departmentId ? Number(departmentId) : null;

      if (modalType === 'create') {
        // 1. Register User (unverified by default for teachers)
        const userResult = await register({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          role: 'teacher',
          is_verified: false // Must be verified
        });

        // 2. Create Teacher Link
        await createTeacher({
          user_id: userResult.id,
          teacher_id: teacherId,
          specialization: specialization || null,
          department_id: parsedDeptId,
        });
        
        setIsModalOpen(false);
        fetchData();
        // Open verification simulation details
        openVerificationModal(email);
      } else {
        // Edit teacher info
        await updateTeacher(selectedTeacher.id, {
          specialization: specialization || null,
          department_id: parsedDeptId,
        });
        setIsModalOpen(false);
        fetchData();
      }
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

  const filteredTeachers = teachers.filter(teacher =>
    teacher.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.teacher_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">Teacher Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage faculty members, departments, and credentials verification.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-medium text-sm"
        >
          <Plus size={18} />
          <span>Add Teacher</span>
        </button>
      </div>

      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex gap-4 items-center transition-colors">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search teacher by ID, name, or email..." 
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
                  <th className="px-6 py-4">Teacher ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No teachers found
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher) => {
                    const deptName = departments.find(d => d.id === teacher.department_id)?.name || 'N/A';
                    const isVerified = teacher.user?.is_verified;
                    return (
                      <tr key={teacher.id} className="hover:bg-slate-50 dark:hover:bg-white/5 border-b border-slate-200 dark:border-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{teacher.teacher_id}</td>
                        <td className="px-6 py-4 text-slate-800 dark:text-slate-300">{teacher.user?.first_name} {teacher.user?.last_name}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{teacher.user?.email}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{deptName}</td>
                        <td className="px-6 py-4">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                              <CheckCircle size={12} />
                              Verified
                            </span>
                          ) : (
                            <button
                              onClick={() => openVerificationModal(teacher.user?.email)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 hover:opacity-90 transition-opacity"
                            >
                              <AlertCircle size={12} />
                              Pending Verification
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => openEditModal(teacher)}
                              title="Edit Profile"
                              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(teacher.id)}
                              title="Delete Teacher"
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
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-8" style={{ animation: 'scaleUp 0.2s ease-out' }}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {modalType === 'create' ? 'Add New Teacher' : 'Edit Teacher Details'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white transition-colors"
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
                      placeholder="Jane"
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
                      placeholder="Smith"
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
                      placeholder="jane.smith@university.edu"
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
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Teacher ID</label>
                  <input 
                    type="text" 
                    required
                    disabled={modalType === 'edit'}
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    placeholder="TCH-2025-001"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Department</label>
                  <select 
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id} className="bg-white dark:bg-slate-900">{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Specialization</label>
                  <input 
                    type="text" 
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="Machine Learning, Quantum Computing, etc."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500"
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
                  {modalType === 'create' ? 'Add Teacher' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verification Simulation Modal */}
      {verificationModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4" style={{ animation: 'scaleUp 0.2s ease-out' }}>
            <div className="flex items-center gap-3 text-amber-500">
              <Mail size={24} />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Email Verification Link</h3>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Since email servers are simulated, please copy this verification link to verify the teacher profile:
            </p>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-white/5">
              <input 
                type="text" 
                readOnly 
                value={getVerificationUrl()}
                className="bg-transparent text-xs text-slate-600 dark:text-slate-400 focus:outline-none flex-1 truncate select-all"
              />
              <button
                onClick={handleCopyLink}
                className="p-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-700 dark:text-white rounded-lg transition-colors flex-shrink-0"
                title="Copy Link"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <a 
                href={getVerificationUrl()} 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center hover:opacity-90"
              >
                Open Link Directly
              </a>
              <button
                onClick={() => setVerificationModalOpen(false)}
                className="px-4 py-2 border border-slate-200 dark:border-white/15 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
