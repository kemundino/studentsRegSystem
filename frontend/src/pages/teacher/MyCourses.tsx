import React from 'react';
import { BookOpen, Users, Clock, ArrowRight } from 'lucide-react';

export const TeacherMyCourses = () => {
  const courses = [
    { id: 'CS101', name: 'Introduction to Computer Science', students: 45, schedule: 'Mon, Wed 10:00 AM' },
    { id: 'MATH201', name: 'Advanced Calculus', students: 32, schedule: 'Tue, Thu 2:00 PM' },
    { id: 'PHY101', name: 'General Physics', students: 28, schedule: 'Fri 9:00 AM' },
  ];

  return (
    <div className="p-8 min-h-screen bg-slate-950 text-slate-300 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
          My Courses
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-violet-500/20 text-violet-400 rounded-xl">
                  <BookOpen size={24} />
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-slate-800 text-slate-300 rounded-lg border border-white/5">
                  {course.id}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold text-white mb-2">{course.name}</h2>
              
              <div className="mt-auto space-y-3 pt-4">
                <div className="flex items-center text-slate-400">
                  <Users size={16} className="mr-2" />
                  <span className="text-sm">{course.students} Students Enrolled</span>
                </div>
                <div className="flex items-center text-slate-400">
                  <Clock size={16} className="mr-2" />
                  <span className="text-sm">{course.schedule}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-cyan-400 group-hover:text-cyan-300 transition-colors">
                <span className="text-sm font-medium">Manage Course</span>
                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
