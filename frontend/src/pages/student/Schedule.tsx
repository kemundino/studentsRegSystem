import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Video, BookOpen } from 'lucide-react';

export const StudentSchedule = () => {
  const [customEvents, setCustomEvents] = useState<any[]>([]);

  useEffect(() => {
    loadCustomEvents();
  }, []);

  const loadCustomEvents = () => {
    const saved = localStorage.getItem('schedule_events');
    if (saved) {
      try {
        setCustomEvents(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const defaultSchedule = [
    { day: 'Monday', classes: [
      { time: '10:00 AM - 11:30 AM', course: 'CS101 - Intro to Computer Science', location: 'Room 302', type: 'in-person', sessionType: 'Class' },
      { time: '1:00 PM - 2:00 PM', course: 'ENG102 - Academic Writing', location: 'Zoom', type: 'online', sessionType: 'Class' }
    ]},
    { day: 'Tuesday', classes: [
      { time: '2:00 PM - 3:30 PM', course: 'MATH201 - Advanced Calculus', location: 'Room 405', type: 'in-person', sessionType: 'Class' }
    ]},
    { day: 'Wednesday', classes: [
      { time: '10:00 AM - 11:30 AM', course: 'CS101 - Intro to Computer Science', location: 'Room 302', type: 'in-person', sessionType: 'Class' }
    ]},
    { day: 'Thursday', classes: [
      { time: '2:00 PM - 3:30 PM', course: 'MATH201 - Advanced Calculus', location: 'Room 405', type: 'in-person', sessionType: 'Class' }
    ]},
    { day: 'Friday', classes: [
      { time: '1:00 PM - 2:00 PM', course: 'ENG102 - Academic Writing', location: 'Zoom', type: 'online', sessionType: 'Class' }
    ]},
  ];

  const getCombinedSchedule = () => {
    return defaultSchedule.map(dayPlan => {
      const dayCustom = customEvents.filter(e => e.day === dayPlan.day);
      const customClasses = dayCustom.map(e => ({
        time: e.time,
        course: e.course,
        location: e.room,
        type: e.room.toLowerCase().includes('zoom') ? 'online' : 'in-person',
        sessionType: e.type // Exam or Tutorial
      }));
      return {
        day: dayPlan.day,
        classes: [...dayPlan.classes, ...customClasses]
      };
    });
  };

  const schedule = getCombinedSchedule();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">Class & Exam Schedule</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View your current semester classes, custom tutorials, and final exam schedules.</p>
        </div>
      </div>

      <div className="relative pl-0 md:pl-24">
        {/* Timeline line */}
        <div className="hidden md:block absolute left-28 top-0 bottom-0 w-px bg-slate-200 dark:bg-white/10" />

        <div className="space-y-8">
          {schedule.map((dayPlan, index) => (
            <div key={index} className="relative flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
              {/* Day Label */}
              <div className="md:w-20 shrink-0 md:text-right pt-2">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{dayPlan.day}</h3>
              </div>

              {/* Day Events */}
              <div className="flex-1 space-y-4">
                {dayPlan.classes.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/5 rounded-xl">
                    No classes or exams scheduled.
                  </div>
                ) : (
                  dayPlan.classes.map((cls, idx) => (
                    <div key={idx} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 hover:border-violet-500/30 dark:hover:border-violet-500/20 hover:bg-slate-50/50 dark:hover:bg-white/10 transition-all duration-300 group">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-semibold text-slate-800 dark:text-white group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                              {cls.course}
                            </h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              cls.sessionType === 'Exam' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                              cls.sessionType === 'Tutorial' ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' :
                              'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                            }`}>
                              {cls.sessionType}
                            </span>
                          </div>

                          <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs">
                            <Clock size={13} className="mr-1.5" />
                            <span>{cls.time}</span>
                          </div>

                          <div className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-350">
                            {cls.type === 'online' ? (
                              <Video size={12} className="mr-1.5 text-cyan-500" />
                            ) : (
                              <MapPin size={12} className="mr-1.5 text-amber-500" />
                            )}
                            <span>{cls.location}</span>
                          </div>
                        </div>

                        {cls.type === 'online' && (
                          <button className="self-start px-3.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold rounded-xl border border-cyan-500/20 transition-all duration-300">
                            Join Link
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
