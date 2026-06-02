import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

export const TeacherSchedule = () => {
  const schedule = [
    { day: 'Monday', classes: [{ time: '10:00 AM - 11:30 AM', course: 'CS101', room: 'Room 302' }] },
    { day: 'Tuesday', classes: [{ time: '2:00 PM - 3:30 PM', course: 'MATH201', room: 'Room 405' }] },
    { day: 'Wednesday', classes: [{ time: '10:00 AM - 11:30 AM', course: 'CS101', room: 'Room 302' }] },
    { day: 'Thursday', classes: [{ time: '2:00 PM - 3:30 PM', course: 'MATH201', room: 'Room 405' }] },
    { day: 'Friday', classes: [{ time: '9:00 AM - 12:00 PM', course: 'PHY101', room: 'Lab 1' }] },
  ];

  return (
    <div className="p-8 min-h-screen bg-slate-950 text-slate-300 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
            Weekly Schedule
          </h1>
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white flex items-center transition-all duration-300">
            <CalendarIcon size={18} className="mr-2" />
            Sync Calendar
          </button>
        </div>

        <div className="space-y-6">
          {schedule.map((dayPlan, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-2 h-6 rounded bg-gradient-to-b from-violet-500 to-cyan-500 mr-3"></span>
                {dayPlan.day}
              </h2>
              
              <div className="space-y-4">
                {dayPlan.classes.map((cls, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <div className="flex items-center text-amber-500 w-48 mb-2 sm:mb-0">
                      <Clock size={16} className="mr-2" />
                      <span className="font-medium text-sm">{cls.time}</span>
                    </div>
                    
                    <div className="flex-1">
                      <span className="text-lg font-medium text-white">{cls.course}</span>
                    </div>
                    
                    <div className="flex items-center text-slate-400 mt-2 sm:mt-0">
                      <MapPin size={16} className="mr-1" />
                      <span className="text-sm">{cls.room}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
