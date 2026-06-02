import React from 'react';
import { Award, TrendingUp, BookOpen, Download } from 'lucide-react';

export const StudentGrades = () => {
  const semesters = [
    {
      name: 'Fall 2026 (Current)',
      gpa: '3.8',
      courses: [
        { id: 'CS101', name: 'Intro to Computer Science', credits: 4, grade: 'A', status: 'midterm' },
        { id: 'MATH201', name: 'Advanced Calculus', credits: 4, grade: 'B+', status: 'midterm' },
        { id: 'ENG102', name: 'Academic Writing', credits: 3, grade: 'A-', status: 'midterm' },
      ]
    },
    {
      name: 'Spring 2026',
      gpa: '3.9',
      courses: [
        { id: 'PHY101', name: 'General Physics', credits: 4, grade: 'A', status: 'final' },
        { id: 'CS100', name: 'Programming Basics', credits: 3, grade: 'A+', status: 'final' },
        { id: 'HIST101', name: 'World History', credits: 3, grade: 'B+', status: 'final' },
      ]
    }
  ];

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (grade.startsWith('B')) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    if (grade.startsWith('C')) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="p-8 min-h-screen bg-slate-950 text-slate-300 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
              Academic Transcript
            </h1>
            <p className="text-slate-400">View your grades and academic progress</p>
          </div>
          <button className="px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-white text-sm hover:bg-white/5 transition-colors flex items-center shadow-lg w-fit">
            <Download size={16} className="mr-2" />
            Download PDF
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center">
            <div className="p-4 bg-violet-500/20 text-violet-400 rounded-xl mr-4">
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Cumulative GPA</p>
              <h2 className="text-2xl font-bold text-white">3.85</h2>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center">
            <div className="p-4 bg-cyan-500/20 text-cyan-400 rounded-xl mr-4">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Credits</p>
              <h2 className="text-2xl font-bold text-white">45</h2>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center">
            <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-xl mr-4">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Academic Standing</p>
              <h2 className="text-2xl font-bold text-emerald-400">Excellent</h2>
            </div>
          </div>
        </div>

        {/* Semesters */}
        <div className="space-y-8">
          {semesters.map((semester, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 bg-slate-900/50 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">{semester.name}</h3>
                <div className="px-3 py-1 bg-slate-800 rounded-lg border border-white/5 text-sm font-medium">
                  GPA: <span className="text-white ml-1">{semester.gpa}</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/20 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium">Course Code</th>
                      <th className="px-6 py-4 font-medium">Course Title</th>
                      <th className="px-6 py-4 font-medium">Credits</th>
                      <th className="px-6 py-4 font-medium">Grade</th>
                      <th className="px-6 py-4 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {semester.courses.map((course, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-slate-300 font-mono text-sm">{course.id}</td>
                        <td className="px-6 py-4 font-medium text-white">{course.name}</td>
                        <td className="px-6 py-4 text-slate-400">{course.credits}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-sm font-bold border ${getGradeColor(course.grade)}`}>
                            {course.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-xs font-medium uppercase tracking-wider ${course.status === 'final' ? 'text-slate-500' : 'text-amber-500'}`}>
                            {course.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
