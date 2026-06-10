import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, X, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getTeachers, getCourses } from '../../api/backend';

export const TeacherSchedule = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form states
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [eventType, setEventType] = useState<'Exam' | 'Tutorial'>('Exam');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [time, setTime] = useState('10:00 AM - 11:30 AM');
  const [room, setRoom] = useState('Room 302');

  const defaultSchedule = [
    { id: 'def-1', day: 'Monday', time: '10:00 AM - 11:30 AM', course: 'CS101 - Intro to CS', room: 'Room 302', type: 'Class' },
    { id: 'def-2', day: 'Tuesday', time: '2:00 PM - 3:30 PM', course: 'MATH201 - Calculus', room: 'Room 405', type: 'Class' },
    { id: 'def-3', day: 'Wednesday', time: '10:00 AM - 11:30 AM', course: 'CS101 - Intro to CS', room: 'Room 302', type: 'Class' },
    { id: 'def-4', day: 'Thursday', time: '2:00 PM - 3:30 PM', course: 'MATH201 - Calculus', room: 'Room 405', type: 'Class' },
    { id: 'def-5', day: 'Friday', time: '9:00 AM - 12:00 PM', course: 'PHY101 - Physics', room: 'Lab 1', type: 'Class' },
  ];

  useEffect(() => {
    fetchTeacherCourses();
    loadEvents();
  }, [user]);

  const fetchTeacherCourses = async () => {
    if (!user) return;
    try {
      const teachersList = await getTeachers();
      const currentTeacher = teachersList.find((t: any) => t.user_id === user.id);
      if (currentTeacher) {
        const coursesList = await getCourses({ teacher_id: currentTeacher.id });
        setCourses(coursesList);
      }
    } catch (err) {
      console.error('Failed to fetch teacher courses:', err);
    }
  };

  const loadEvents = () => {
    const saved = localStorage.getItem('schedule_events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find(c => String(c.id) === selectedCourseId);
    const courseLabel = course ? `${course.code} - ${course.name}` : 'Unknown Course';

    const newEvent = {
      id: `evt-${Date.now()}`,
      day: dayOfWeek,
      time,
      course: courseLabel,
      room,
      type: eventType,
      teacherUserId: user?.id
    };

    const updated = [...events, newEvent];
    setEvents(updated);
    localStorage.setItem('schedule_events', JSON.stringify(updated));
    setIsModalOpen(false);
    
    // Clear form
    setSelectedCourseId('');
    setEventType('Exam');
    setDayOfWeek('Monday');
    setTime('10:00 AM - 11:30 AM');
    setRoom('Room 302');
  };

  const handleDeleteEvent = (eventId: string) => {
    if (!confirm('Are you sure you want to remove this scheduled event?')) return;
    const updated = events.filter(e => e.id !== eventId);
    setEvents(updated);
    localStorage.setItem('schedule_events', JSON.stringify(updated));
  };

  // Combine default schedule with user events
  const getDayEvents = (dayName: string) => {
    const defaults = defaultSchedule.filter(d => d.day === dayName);
    const custom = events.filter(e => e.day === dayName);
    return [...defaults, ...custom];
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">Weekly Schedule</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your weekly lectures, scheduled exams, and tutorial sessions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-medium text-sm"
        >
          <Plus size={18} />
          <span>Schedule Exam/Tutorial</span>
        </button>
      </div>

      <div className="space-y-6">
        {days.map((day) => {
          const dayEvents = getDayEvents(day);
          return (
            <div key={day} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 transition-colors">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
                <span className="w-2.5 h-6 rounded bg-gradient-to-b from-violet-500 to-cyan-500 mr-3"></span>
                {day}
              </h2>
              
              {dayEvents.length === 0 ? (
                <p className="text-slate-400 text-sm py-2">No lectures or sessions scheduled.</p>
              ) : (
                <div className="space-y-4">
                  {dayEvents.map((cls, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-150 dark:border-white/5 hover:border-slate-250 dark:hover:border-white/10 transition-all duration-300">
                      <div className="flex items-center text-amber-500 dark:text-amber-400 w-48 mb-2 sm:mb-0">
                        <Clock size={16} className="mr-2" />
                        <span className="font-semibold text-sm">{cls.time}</span>
                      </div>
                      
                      <div className="flex-1 flex items-center gap-3">
                        <span className="text-base font-semibold text-slate-800 dark:text-white">{cls.course}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cls.type === 'Exam' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                          cls.type === 'Tutorial' ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' :
                          'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                        }`}>
                          {cls.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 sm:mt-0 gap-4">
                        <div className="flex items-center text-slate-500 dark:text-slate-450">
                          <MapPin size={16} className="mr-1" />
                          <span className="text-sm">{cls.room}</span>
                        </div>
                        {cls.id.startsWith('evt-') && (
                          <button
                            onClick={() => handleDeleteEvent(cls.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Schedule"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4" style={{ animation: 'scaleUp 0.2s ease-out' }}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <CalendarIcon size={20} className="text-violet-500" />
                Schedule Session
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Select Course</label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-violet-500"
                >
                  <option value="">Select Course...</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id} className="bg-white dark:bg-slate-900">{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Session Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value="Exam">Exam</option>
                    <option value="Tutorial">Tutorial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Day of Week</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Time Slot</label>
                  <input 
                    type="text" 
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 10:00 AM - 11:30 AM"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Room / Lab</label>
                  <input 
                    type="text" 
                    required
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. Room 302 or Lab 1"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/15 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
