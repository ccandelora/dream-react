import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Moon, Star, Calendar } from 'lucide-react';
import { useDreamStore } from '../store/dreamStore';

export default function DreamCalendar() {
  const dreams = useDreamStore((state) => state.dreams);
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDreamsByDate = (date: Date) => {
    return dreams.filter(dream => {
      const dreamDate = new Date(dream.createdAt);
      return (
        dreamDate.getDate() === date.getDate() &&
        dreamDate.getMonth() === date.getMonth() &&
        dreamDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayDreams = getDreamsByDate(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`h-24 border border-purple-300/10 rounded-lg p-2 ${
            isToday ? 'bg-purple-500/20' : 'hover:bg-white/5'
          } transition-colors`}
        >
          <div className="flex justify-between items-start">
            <span className="text-purple-200">{day}</span>
            {dayDreams.length > 0 && (
              <div className="flex items-center gap-1">
                <Moon className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-purple-300">{dayDreams.length}</span>
              </div>
            )}
          </div>
          {dayDreams.map((dream, index) => (
            <div
              key={dream.id}
              className="mt-1 text-xs text-purple-200 truncate"
              title={dream.content}
            >
              {index === 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-purple-300" />
                  <span>{dream.content.slice(0, 20)}...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Dream Calendar
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-purple-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-purple-300 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-purple-300 font-medium py-2">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500/20" />
          <span className="text-purple-200">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-purple-300" />
          <span className="text-purple-200">Dreams Recorded</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-purple-300" />
          <span className="text-purple-200">Featured Dream</span>
        </div>
      </div>
    </div>
  );
}