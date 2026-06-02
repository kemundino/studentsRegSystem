import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  Clock,
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
import { getStudentStats } from '../../api/backend';
import { useAuth } from '../../context/AuthContext';

const currentCourses = [
  { id: 1, name: 'Advanced Calculus', code: 'MATH301', professor: 'Dr. Sarah Chen', progress: 72, color: '#8b5cf6' },
  { id: 2, name: 'Data Structures', code: 'CS201', professor: 'Prof. James Wilson', progress: 85, color: '#06b6d4' },
  { id: 3, name: 'Physics II', code: 'PHY202', professor: 'Dr. Emily Roberts', progress: 60, color: '#10b981' },
  { id: 4, name: 'Technical Writing', code: 'ENG105', professor: 'Prof. Maria Lopez', progress: 90, color: '#f59e0b' },
  { id: 5, name: 'Digital Logic', code: 'ECE150', professor: 'Dr. Kevin Park', progress: 45, color: '#f43f5e' },
];

const upcomingSchedule = [
  { id: 1, course: 'Advanced Calculus', time: '09:00 AM - 10:30 AM', room: 'Room 301', professor: 'Dr. Sarah Chen', day: 'Today' },
  { id: 2, course: 'Data Structures', time: '11:00 AM - 12:30 PM', room: 'Lab 102', professor: 'Prof. James Wilson', day: 'Today' },
  { id: 3, course: 'Physics II', time: '02:00 PM - 03:30 PM', room: 'Room 205', professor: 'Dr. Emily Roberts', day: 'Tomorrow' },
  { id: 4, course: 'Technical Writing', time: '10:00 AM - 11:30 AM', room: 'Room 118', professor: 'Prof. Maria Lopez', day: 'Tomorrow' },
];

const gradeDistribution = [
  { subject: 'MATH301', grade: 3.8, color: '#8b5cf6' },
  { subject: 'CS201', grade: 3.9, color: '#06b6d4' },
  { subject: 'PHY202', grade: 3.4, color: '#10b981' },
  { subject: 'ENG105', grade: 3.7, color: '#f59e0b' },
  { subject: 'ECE150', grade: 3.5, color: '#f43f5e' },
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
        <p className="text-slate-300 text-xs mt-1">GPA: <span className="text-white font-medium">{payload[0].value.toFixed(1)}</span></p>
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

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const studentStats = await getStudentStats(user.id);
          setStats([
            { label: 'Current GPA', value: studentStats.gpa.toFixed(2), icon: Award, gradient: 'from-violet-500 to-purple-600', sub: 'Out of 4.0' },
            { label: 'Credits Earned', value: studentStats.credits.toString(), icon: GraduationCap, gradient: 'from-cyan-500 to-blue-600', sub: 'of 120 required' },
            { label: 'Courses Enrolled', value: studentStats.courses.toString(), icon: BookOpen, gradient: 'from-emerald-500 to-green-600', sub: 'This semester' },
            { label: 'Attendance', value: `${studentStats.attendance}%`, icon: CheckCircle2, gradient: 'from-amber-500 to-orange-600', sub: '+2% vs last month' },
          ]);
        }
      } catch (err) {
        console.error("Failed to load student stats", err);
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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.first_name || 'Student'}</h1>
            <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400 text-sm">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300">
            View Transcript
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="glass rounded-2xl p-5 hover:border-violet-500/30 transition-all duration-300 group"
                style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: `${0.1 + i * 0.08}s`, opacity: 0 }}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon size={20} className="text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-4">{stat.value}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{stat.label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{stat.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Courses & Grade Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Current Courses */}
          <div
            className="lg:col-span-2 glass rounded-2xl p-6"
            style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: '0.45s', opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Current Courses</h2>
              <span className="text-xs text-slate-500 bg-slate-100 dark:bg-white/[0.05] px-3 py-1 rounded-full">Fall 2025</span>
            </div>
            <div className="space-y-4">
              {currentCourses.map((course) => (
                <div key={course.id} className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.04] hover:border-violet-500/30 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-900 dark:text-white font-semibold text-sm">{course.name}</span>
                        <span className="text-xs text-slate-500 bg-slate-200/50 dark:bg-white/[0.05] px-2 py-0.5 rounded-full">{course.code}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <User size={12} className="text-slate-400 dark:text-slate-500" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">{course.professor}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{course.progress}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${course.progress}%`, backgroundColor: course.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grade Distribution */}
          <div
            className="glass rounded-2xl p-6"
            style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: '0.55s', opacity: 0 }}
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Grade Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 4.0]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="grade" radius={[6, 6, 0, 0]} barSize={28}>
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-violet-500/5 to-cyan-500/5 dark:from-violet-500/10 dark:to-cyan-500/10 border border-slate-200 dark:border-white/[0.04]">
              <p className="text-xs text-slate-600 dark:text-slate-300 text-center">
                Semester GPA: <span className="text-slate-900 dark:text-white font-bold text-sm">3.67</span> / 4.0
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div
          className="glass rounded-2xl p-6"
          style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: '0.65s', opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Schedule</h2>
            <button className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors">Full Schedule</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSchedule.map((item) => (
              <div
                key={item.id}
                className="relative p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.04] hover:border-violet-500/30 transition-all duration-300 group"
              >
                {/* Timeline dot */}
                <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-gradient-to-b from-violet-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    item.day === 'Today' ? 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400' : 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400'
                  }`}>
                    {item.day}
                  </span>
                </div>
                <h3 className="text-slate-900 dark:text-white font-semibold text-sm">{item.course}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><Clock size={12} /> {item.time}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {item.room}</span>
                  <span className="flex items-center gap-1"><User size={12} /> {item.professor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
