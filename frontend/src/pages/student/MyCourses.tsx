import React from 'react';
import { Book, User, CalendarDays, MoreHorizontal } from 'lucide-react';

export const StudentMyCourses = () => {
  const enrolledCourses = [
    { id: 'CS101', name: 'Introduction to Computer Science', instructor: 'Dr. Alan Turing', credits: 4, progress: 75 },
    { id: 'MATH201', name: 'Advanced Calculus', instructor: 'Dr. Isaac Newton', credits: 4, progress: 60 },
    { id: 'ENG102', name: 'Academic Writing', instructor: 'Prof. Jane Austen', credits: 3, progress: 90 },
  ];

  return (
    <div className="p-8 min-h-screen bg-slate-950 text-slate-300 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
              My Learning
            </h1>
            <p className="text-slate-400 text-sm">You are currently enrolled in {enrolledCourses.length} courses</p>
          </div>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm hover:bg-white/10 transition-colors">
            Browse Course Catalog
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map(course => (
            <div key={course.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-slate-400 hover:text-white">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl text-white shadow-lg shadow-violet-500/20">
                  <Book size={20} />
                </div>
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  {course.id}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold text-white mb-4 line-clamp-2 min-h-[3.5rem]">{course.name}</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-slate-400 text-sm">
                  <User size={14} className="mr-2 text-violet-400" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center text-slate-400 text-sm">
                  <CalendarDays size={14} className="mr-2 text-cyan-400" />
                  <span>{course.credits} Credits</span>
                </div>
              </div>
              
              <div className="mt-auto">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Course Progress</span>
                  <span className="text-white font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-violet-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
