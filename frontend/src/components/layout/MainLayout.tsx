import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LogOut,
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Building,
  ChevronLeft,
  Menu,
  Bell,
  Search,
  X,
  Calendar,
  ClipboardList,
  Settings,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getNavItems = (): NavItem[] => {
    switch (user.role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
          { name: 'Students', path: '/admin/students', icon: <Users size={20} /> },
          { name: 'Faculty', path: '/admin/faculty', icon: <GraduationCap size={20} /> },
          { name: 'Courses', path: '/admin/courses', icon: <BookOpen size={20} /> },
          { name: 'Departments', path: '/admin/departments', icon: <Building size={20} /> },
          { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
        ];
      case 'teacher':
        return [
          { name: 'Dashboard', path: '/teacher', icon: <LayoutDashboard size={20} /> },
          { name: 'My Courses', path: '/teacher/courses', icon: <BookOpen size={20} /> },
          { name: 'Schedule', path: '/teacher/schedule', icon: <Calendar size={20} /> },
          { name: 'Gradebook', path: '/teacher/grades', icon: <ClipboardList size={20} /> },
        ];
      case 'student':
        return [
          { name: 'Dashboard', path: '/student', icon: <LayoutDashboard size={20} /> },
          { name: 'My Courses', path: '/student/courses', icon: <BookOpen size={20} /> },
          { name: 'Schedule', path: '/student/schedule', icon: <Calendar size={20} /> },
          { name: 'Grades', path: '/student/grades', icon: <ClipboardList size={20} /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const isActive = (path: string) => location.pathname === path;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0a0e1a] text-slate-850 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 h-full
          flex flex-col
          bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-xl
          border-r border-slate-200 dark:border-white/[0.06]
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-64' : 'w-20'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Area */}
        <div className={`flex items-center h-16 px-4 border-b border-slate-200 dark:border-white/[0.06] ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <GraduationCap className="text-white" size={20} />
              </div>
              <span className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">UniSystem</span>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <GraduationCap className="text-white" size={20} />
            </div>
          )}

          {/* Collapse button (desktop only) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all duration-200"
          >
            <ChevronLeft
              size={16}
              className={`transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Close button (mobile) */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-200 relative
                  ${active
                    ? 'bg-gradient-to-r from-violet-500/10 to-cyan-500/5 dark:from-violet-500/15 dark:to-cyan-500/10 text-violet-600 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                  }
                `}
                title={!sidebarOpen ? item.name : undefined}
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-violet-500 to-cyan-500" />
                )}

                <span className={`flex-shrink-0 ${active ? 'text-violet-500 dark:text-violet-400' : 'group-hover:text-violet-500 dark:group-hover:text-violet-400'} transition-colors`}>
                  {item.icon}
                </span>

                {sidebarOpen && (
                  <span className="text-sm truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-slate-200 dark:border-white/[0.06] p-3">
          {sidebarOpen ? (
            <div className="mb-2 px-3 py-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/15 to-cyan-500/15 dark:from-violet-500/30 dark:to-cyan-500/30 border border-violet-500/20 flex items-center justify-center text-sm font-bold text-violet-600 dark:text-white flex-shrink-0">
                  {user.first_name[0]}{user.last_name[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/15 to-cyan-500/15 dark:from-violet-500/30 dark:to-cyan-500/30 border border-violet-500/20 flex items-center justify-center text-sm font-bold text-violet-600 dark:text-white">
                {user.first_name[0]}{user.last_name[0]}
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className={`
              flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
              text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10
              transition-all duration-200
              ${!sidebarOpen ? 'justify-center' : ''}
            `}
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-200 dark:border-white/[0.06] bg-white/80 dark:bg-[#0d1117]/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 flex-shrink-0 transition-colors duration-300">
          {/* Left: Mobile menu + Greeting */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-500 dark:text-slate-400 transition-colors"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{getGreeting()},</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white -mt-0.5">{user.first_name} {user.last_name}</p>
            </div>
          </div>

          {/* Right: Search + Notifications */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-slate-500 dark:text-slate-400 w-64 transition-all duration-200 focus-within:border-violet-500/30 focus-within:bg-slate-50 dark:focus-within:bg-white/[0.06]">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 w-full"
              />
            </div>

            {/* Notifications */}
            <button className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-slate-50 dark:bg-[#0a0e1a]/40 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
