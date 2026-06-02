import { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  GraduationCap,
  Building,
  TrendingUp,
  TrendingDown,
  UserPlus,
  FilePlus,
  BarChart3,
  Settings,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getAdminStats } from '../../api/backend';
import { useAuth } from '../../context/AuthContext';

const quickActions = [
  { label: 'Add Student', icon: UserPlus, gradient: 'from-violet-500 to-purple-600' },
  { label: 'Create Course', icon: FilePlus, gradient: 'from-cyan-500 to-blue-600' },
  { label: 'View Reports', icon: BarChart3, gradient: 'from-emerald-500 to-green-600' },
  { label: 'System Settings', icon: Settings, gradient: 'from-amber-500 to-orange-600' },
];

const fadeInUpKeyframes = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}`;

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl">
        <p className="text-white font-semibold text-sm mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-slate-300 text-xs">
            {entry.dataKey === 'students' ? 'Students' : 'Courses'}: <span className="text-white font-medium">{entry.value}</span>
          </p>
        ))}
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

export const AdminDashboard = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState<any[]>([]);
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
  const [courseDistribution, setCourseDistribution] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await getAdminStats();

        setStats([
          { label: 'Total Students', value: statsData.totalStudents.toLocaleString(), trend: '+12.5%', trendUp: true, icon: Users, gradient: 'from-violet-500 to-purple-600' },
          { label: 'Active Courses', value: statsData.activeCourses.toLocaleString(), trend: '+4.2%', trendUp: true, icon: BookOpen, gradient: 'from-cyan-500 to-blue-600' },
          { label: 'Faculty Members', value: statsData.facultyMembers.toLocaleString(), trend: '+2.1%', trendUp: true, icon: GraduationCap, gradient: 'from-emerald-500 to-green-600' },
          { label: 'Departments', value: statsData.departments.toLocaleString(), trend: '0%', trendUp: false, icon: Building, gradient: 'from-amber-500 to-orange-600' },
        ]);
        
        // Placeholder data for charts - will be replaced with real API calls later
        setEnrollmentData([
          { month: 'Jan', students: 186, courses: 80 },
          { month: 'Feb', students: 205, courses: 85 },
          { month: 'Mar', students: 237, courses: 90 },
          { month: 'Apr', students: 273, courses: 95 },
          { month: 'May', students: 209, courses: 88 },
          { month: 'Jun', students: 214, courses: 82 },
          { month: 'Jul', students: 225, courses: 85 },
          { month: 'Aug', students: 298, courses: 100 },
          { month: 'Sep', students: 348, courses: 120 },
          { month: 'Oct', students: 380, courses: 130 },
          { month: 'Nov', students: 351, courses: 125 },
          { month: 'Dec', students: 340, courses: 118 },
        ]);
        
        setCourseDistribution([
          { name: 'Engineering', value: 35, color: '#8b5cf6' },
          { name: 'Business', value: 25, color: '#06b6d4' },
          { name: 'Sciences', value: 20, color: '#10b981' },
          { name: 'Arts', value: 12, color: '#f59e0b' },
          { name: 'Medicine', value: 8, color: '#f43f5e' },
        ]);
        
        setActivities([
          { id: 1, user: 'Sarah Johnson', action: 'enrolled in Advanced Mathematics', time: '2 min ago', color: 'bg-violet-500' },
          { id: 2, user: 'Dr. Michael Chen', action: 'submitted grades for Physics 101', time: '15 min ago', color: 'bg-cyan-500' },
          { id: 3, user: 'Emily Davis', action: 'registered for Fall 2025 semester', time: '1 hour ago', color: 'bg-emerald-500' },
          { id: 4, user: 'Admin System', action: 'backed up database successfully', time: '3 hours ago', color: 'bg-amber-500' },
          { id: 5, user: 'James Wilson', action: 'updated course curriculum for CS201', time: '5 hours ago', color: 'bg-rose-500' },
        ]);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.first_name || 'Admin'}</h1>
            <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400 text-sm">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300">
            Download Report
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="glass rounded-2xl p-5 transition-all duration-300 group"
                style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: `${0.1 + i * 0.08}s`, opacity: 0 }}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.trendUp
                        ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10'
                        : 'text-slate-500 dark:text-slate-400 bg-slate-500/10'
                    }`}
                  >
                    {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {stat.trend}
                  </span>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-4">{stat.value}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Enrollment Analytics */}
          <div
            className="lg:col-span-2 glass rounded-2xl p-6"
            style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: '0.45s', opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Enrollment Analytics</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-white/[0.05] px-3 py-1 rounded-full">2025</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="courseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="students" stroke="#8b5cf6" strokeWidth={2} fill="url(#studentGrad)" />
                  <Area type="monotone" dataKey="courses" stroke="#06b6d4" strokeWidth={2} fill="url(#courseGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 mt-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-violet-500 rounded-full" /> Students</span>
              <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-cyan-500 rounded-full" /> Courses</span>
            </div>
          </div>

          {/* Course Distribution */}
          <div
            className="glass rounded-2xl p-6"
            style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: '0.55s', opacity: 0 }}
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Course Distribution</h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {courseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15,23,42,0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {courseDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="text-slate-900 dark:text-white font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent Activity */}
          <div
            className="lg:col-span-2 glass rounded-2xl p-6"
            style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: '0.65s', opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
              <button className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors">View All</button>
            </div>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 group">
                  <div className="relative mt-0.5">
                    <div className={`w-9 h-9 rounded-full ${activity.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {activity.user.charAt(0)}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-950 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-600 dark:text-slate-200">
                      <span className="font-semibold text-slate-900 dark:text-white">{activity.user}</span>{' '}
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div
            className="glass rounded-2xl p-6"
            style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: '0.75s', opacity: 0 }}
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    className="group relative bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] rounded-xl p-4 flex flex-col items-center gap-3 hover:border-transparent transition-all duration-300 overflow-hidden"
                  >
                    {/* Gradient border on hover */}
                    <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-transparent bg-gradient-to-r from-violet-500/10 to-cyan-500/10 dark:from-violet-500/20 dark:to-cyan-500/20" />
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {action.label}
                    </span>
                    <ArrowRight size={14} className="text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
