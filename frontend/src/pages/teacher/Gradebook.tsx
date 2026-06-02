import React, { useState } from 'react';
import { Search, Save, CheckCircle, AlertCircle } from 'lucide-react';

export const TeacherGradebook = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS101');
  
  const students = [
    { id: 'ST001', name: 'Alice Johnson', grade: 'A', score: 95 },
    { id: 'ST002', name: 'Bob Smith', grade: 'B+', score: 88 },
    { id: 'ST003', name: 'Charlie Davis', grade: 'A-', score: 92 },
    { id: 'ST004', name: 'Diana Evans', grade: 'C', score: 75 },
    { id: 'ST005', name: 'Ethan Hunt', grade: 'B', score: 84 },
  ];

  return (
    <div className="p-8 min-h-screen bg-slate-950 text-slate-300 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
            Gradebook
          </h1>
          
          <div className="flex gap-4">
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-slate-900 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-violet-500 transition-colors"
            >
              <option value="CS101">CS101 - Intro to CS</option>
              <option value="MATH201">MATH201 - Calculus</option>
              <option value="PHY101">PHY101 - Physics</option>
            </select>
            
            <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 flex items-center transition-opacity shadow-lg shadow-violet-500/20">
              <Save size={18} className="mr-2" />
              Save Grades
            </button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center bg-slate-900/50">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="w-full bg-slate-800 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-violet-500 transition-colors placeholder:text-slate-500 text-sm"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/30 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Student ID</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Score (0-100)</th>
                  <th className="p-4 font-medium">Final Grade</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map(student => (
                  <tr key={student.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-slate-300 font-mono text-sm">{student.id}</td>
                    <td className="p-4 font-medium text-white">{student.name}</td>
                    <td className="p-4">
                      <input 
                        type="number" 
                        defaultValue={student.score}
                        className="w-20 bg-slate-800 border border-white/10 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                      />
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        student.score >= 90 ? 'bg-emerald-500/20 text-emerald-400' :
                        student.score >= 80 ? 'bg-cyan-500/20 text-cyan-400' :
                        student.score >= 70 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        {student.grade}
                      </span>
                    </td>
                    <td className="p-4">
                      {student.score >= 60 ? (
                        <div className="flex items-center text-emerald-500">
                          <CheckCircle size={16} className="mr-1" />
                          <span className="text-xs font-medium">Passing</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-rose-500">
                          <AlertCircle size={16} className="mr-1" />
                          <span className="text-xs font-medium">Failing</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
