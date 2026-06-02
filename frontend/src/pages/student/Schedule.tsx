import React from 'react';
import { Calendar, Clock, MapPin, Video } from 'lucide-react';

export const StudentSchedule = () => {
  const schedule = [
    { day: 'Monday', classes: [
      { time: '10:00 AM - 11:30 AM', course: 'CS101 - Intro to Computer Science', location: 'Room 302', type: 'in-person' },
      { time: '1:00 PM - 2:00 PM', course: 'ENG102 - Academic Writing', location: 'Zoom', type: 'online' }
    ]},
    { day: 'Tuesday', classes: [
      { time: '2:00 PM - 3:30 PM', course: 'MATH201 - Advanced Calculus', location: 'Room 405', type: 'in-person' }
    ]},
    { day: 'Wednesday', classes: [
      { time: '10:00 AM - 11:30 AM', course: 'CS101 - Intro to Computer Science', location: 'Room 302', type: 'in-person' }
    ]},
    { day: 'Thursday', classes: [
      { time: '2:00 PM - 3:30 PM', course: 'MATH201 - Advanced Calculus', location: 'Room 405', type: 'in-person' }
    ]},
    { day: 'Friday', classes: [
      { time: '1:00 PM - 2:00 PM', course: 'ENG102 - Academic Writing', location: 'Zoom', type: 'online' }
    ]},
  ];

  return (
    <div className="p-8 min-h-screen bg-slate-950 text-slate-300 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-violet-500/10 text-violet-400 rounded-2xl mb-4">
            <Calendar size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Class Schedule</h1>
          <p className="text-slate-400">Current Semester - Fall 2026</p>
        </header>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="hidden md:block absolute left-32 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

          <div className="space-y-8">
            {schedule.map((dayPlan, index) => (
              <div key={index} className="relative flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                <div className="md:w-24 shrink-0 pt-4 text-right md:pr-4">
                  <h3 className="text-lg font-bold text-white">{dayPlan.day}</h3>
                </div>
                
                <div className="flex-1 space-y-4">
                  {dayPlan.classes.map((cls, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-violet-500/30 hover:bg-white/10 transition-all duration-300 group">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-violet-400 transition-colors">{cls.course}</h4>
                          <div className="flex items-center text-slate-400 text-sm mb-3">
                            <Clock size={14} className="mr-1.5" />
                            {cls.time}
                          </div>
                          <div className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 border border-white/5 text-slate-300">
                            {cls.type === 'online' ? (
                              <Video size={12} className="mr-1.5 text-cyan-400" />
                            ) : (
                              <MapPin size={12} className="mr-1.5 text-amber-400" />
                            )}
                            {cls.location}
                          </div>
                        </div>
                        {cls.type === 'online' && (
                          <button className="self-start px-3 py-1.5 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-lg hover:bg-cyan-500/20 transition-colors">
                            Join Link
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {dayPlan.classes.length === 0 && (
                    <div className="h-16 flex items-center justify-center bg-slate-900/30 rounded-2xl border border-dashed border-white/5 text-slate-500 text-sm">
                      No classes scheduled
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
