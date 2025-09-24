'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from 'lucide-react';
import { Appointment } from '@/lib/types';
import { appointmentsApi } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/utils';

interface CalendarViewProps {
  onAppointmentClick?: (appointment: Appointment) => void;
}

export function CalendarView({ onAppointmentClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, [currentDate]);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      // Get appointments for the current month
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      // For now, load all appointments and filter client-side
      // In a real app, you'd filter server-side
      const allAppointments = await appointmentsApi.getAll();

      const monthAppointments = allAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= startOfMonth && appointmentDate <= endOfMonth;
      });

      setAppointments(monthAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getAppointmentsForDay = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return appointments.filter(appointment => appointment.date === dateString);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day &&
           today.getMonth() === currentDate.getMonth() &&
           today.getFullYear() === currentDate.getFullYear();
  };

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Calendar className="h-6 w-6 text-accent" />
          <h2 className="text-xl font-semibold text-fg">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-fg" />
          </button>

          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-accent text-bg rounded-full hover:bg-opacity-80 transition-colors"
          >
            Today
          </button>

          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-fg" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-muted">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          const dayAppointments = day ? getAppointmentsForDay(day) : [];
          const hasAppointments = dayAppointments.length > 0;

          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border border-white border-opacity-10 rounded-theme ${
                day ? 'hover:bg-white hover:bg-opacity-5 cursor-pointer' : ''
              } ${isToday(day || 0) ? 'bg-accent bg-opacity-10 border-accent' : ''}`}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium mb-2 ${isToday(day) ? 'text-accent' : 'text-fg'}`}>
                    {day}
                  </div>

                  {hasAppointments && (
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="p-1 bg-accent bg-opacity-20 rounded text-xs cursor-pointer hover:bg-opacity-30 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAppointmentClick?.(appointment);
                          }}
                          title={`${appointment.patientName} - ${appointment.type} at ${formatTime(appointment.time)}`}
                        >
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span className="truncate">{formatTime(appointment.time)}</span>
                          </div>
                          <div className="truncate text-xs opacity-80">
                            {appointment.patientName}
                          </div>
                        </div>
                      ))}

                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-muted">
                          +{dayAppointments.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Appointments List for Selected Day */}
      {isLoading && (
        <div className="text-center py-4 text-muted">
          Loading appointments...
        </div>
      )}

      {!isLoading && appointments.length === 0 && (
        <div className="text-center py-8 text-muted">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No appointments scheduled for {monthNames[currentDate.getMonth()]}</p>
        </div>
      )}
    </div>
  );
}

