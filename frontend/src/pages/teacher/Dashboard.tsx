import { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  Clock,
  ClipboardCheck,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getTeacherStats } from '../../api/backend';
import { useAuth } from '../../context/AuthContext';

const weeklySchedule = [
  { day: 'Monday', classes: [{ time: '09:00 - 10:30', course: 'Data Structures', room: 'Room 301' }, { time: '14:00 - 15:30', course: 'Algorithms', room: 'Room 205' }] },
  { day: 'Tuesday', classes: [{ time: '11:00 - 12:30', course: 'Database Systems', room: 'Lab 102' }] },
  { day: 'Wednesday', classes: [{ time: '09:00 - 10:30', course: 'Data Structures', room: 'Room 301' }, { time: '16:00 - 17:30', course: 'Software Engineering', room: 'Room 401' }] },
  { day: 'Thursday', classes: [{ time: '11:00 - 12:30', course: 'Database Systems', room: 'Lab 102' }, { time: '14:00 - 15:30', course: 'Algorithms', room: 'Room 205' }] },
  { day: 'Friday', classes: [{ time: '10:00 - 11:30', course: 'Machine Learning', room: 'Lab 204' }] },
];

const recentSubmissions = [
  { id: 1, student: 'Alice Martin', assignment: 'DSA Assignment 3', time: '10 min ago', status: 'submitted' },
  { id: 2, student: 'Robert Lee', assignment: 'ML Project Proposal', time: '45 min ago', status: 'submitted' },
  { id: 3, student: 'Jessica Brown', assignment: 'DB Lab Report 5', time: '2 hours ago', status: 'late' },
  { id: 4, student: 'David Kim', assignment: 'SE Sprint Review', time: '3 hours ago', status: 'submitted' },
  { id: 5, student: 'Mia Patel', assignment: 'Algorithms Midterm', time: '5 hours ago', status: 'submitted' },
];

const performanceData = [
  { course: 'Data Struct.', avg: 82, color: '#8b5cf6' },
  { course: 'Algorithms', avg: 76, color: '#06b6d4' },
  { course: 'DB Systems', avg: 88, color: '#10b981' },
  { course: 'Soft. Eng.', avg: 91, color: '#f59e0b' },
  { course: 'ML', avg: 79, color: '#f43f5e' },
  { course: 'Web Dev', avg: 85, color: '#a855f7' },
];

const fadeInUpKeyframes = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}`;

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl">
        <p className="text-white font-semibold text-sm">{label}</p>
        <p className="text-slate-300 text-xs mt-1">Average: <span className="text-white font-medium">{payload[0].value}%</span></p>
      </div>
    );
  }
  return null;
};

const today = new Date();
const formattedDate = today.toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const teacherStats = await getTeacherStats(user.id);
          setStats([
            { label: 'My Courses', value: teacherStats.courses.toString(), icon: BookOpen, gradient: 'from-violet-500 to-purple-600', change: '+1 this semester' },
            { label: 'Total Students', value: teacherStats.students.toString(), icon: Users, gradient: 'from-cyan-500 to-blue-600', change: '+18 new' },
            { label: 'Avg Attendance', value: `${teacherStats.attendance}%`, icon: Clock, gradient: 'from-emerald-500 to-green-600', change: '+3% vs last month' },
            { label: 'Pending Grades', value: teacherStats.pendingGrades.toString(), icon: ClipboardCheck, gradient: 'from-amber-500 to-orange-600', change: 'Due in 5 days' },
          ]);
        }
      } catch (err) {
        console.error("Failed to load teacher stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-transparent">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <style>{fadeInUpKeyframes}</style>
      <div className="space-y-6 p-6 min-h-screen bg-transparent">
        {/* Welcome Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{ animation: 'fadeInUp 0.5s ease-out forwards', opacity: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.first_name || 'Professor'}</h1>
            <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400 text-sm">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300">
            Grade Submissions
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="glass rounded-2xl p-5 transition-all duration-300 group hover:border-violet-500/30"
                style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: `${0.1 + i * 0.08}s`, opacity: 0 }}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon size={20} className="text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-4">{stat.value}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{stat.label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* Schedule & Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Weekly Schedule */}
          <div
            className="lg:col-span-2 glass rounded-2xl p-6"
            style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: '0.45s', opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Weekly Schedule</h2>
              <span className="text-xs text-slate-500 bg-slate-100 dark:bg-white/[0.05] px-3 py-1 rounded-full">This Week</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/[0.06]">
                    <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">Day</th>
                    <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">Time</th>
                    <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">Course</th>
                    <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">Room</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklySchedule.map((day) =>
                    day.classes.map((cls, ci) => (
                      <tr key={`${day.day}-${ci}`} className="border-b border-slate-100 dark:border-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">
                          {ci === 0 ? day.day : ''}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{cls.time}</td>
                        <td className="py-3 px-4">
                          <span className="text-slate-800 dark:text-white">{cls.course}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{cls.room}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Class Performance */}
          <div
            className="glass rounded-2xl p-6"
            style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: '0.55s', opacity: 0 }}
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Class Performance</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="course" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={75} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avg" radius={[0, 6, 6, 0]} barSize={14}>
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div
          className="glass rounded-2xl p-6"
          style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: '0.65s', opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Submissions</h2>
            <button className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors">View All</button>
          </div>
          <div className="space-y-3">
            {recentSubmissions.map((sub) => (
              <div key={sub.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors border border-transparent dark:hover:border-white/[0.04]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {sub.student.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 dark:text-white font-medium">{sub.student}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <FileText size={12} className="text-slate-500" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{sub.assignment}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-500">{sub.time}</span>
                  {sub.status === 'submitted' ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={12} /> On time
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/10 px-2 py-0.5 rounded-full">
                      <AlertCircle size={12} /> Late
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
