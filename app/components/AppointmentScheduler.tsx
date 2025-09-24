'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Stethoscope, Plus, X } from 'lucide-react';
import { Appointment, Patient } from '@/lib/types';
import { patientsApi, appointmentsApi } from '@/lib/api';
import { generateId } from '@/lib/utils';

interface AppointmentSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (appointment: Appointment) => void;
  initialData?: Partial<Appointment>;
  followUpForPrescription?: string; // prescription ID for follow-up
}

export function AppointmentScheduler({
  isOpen,
  onClose,
  onSchedule,
  initialData,
  followUpForPrescription
}: AppointmentSchedulerProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    date: '',
    time: '',
    type: 'consultation' as Appointment['type'],
    reason: '',
    duration: 30,
    notes: '',
  });

  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      loadPatients();
      if (initialData) {
        setFormData(prev => ({ ...prev, ...initialData }));
      }
      if (followUpForPrescription) {
        setFormData(prev => ({
          ...prev,
          type: 'follow-up',
          reason: `Follow-up for prescription ${followUpForPrescription}`,
        }));
      }
    }
  }, [isOpen, initialData, followUpForPrescription]);

  const loadPatients = async () => {
    try {
      const patientsData = await patientsApi.getAll();
      setPatients(patientsData);
      setFilteredPatients(patientsData);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const handlePatientSearch = (search: string) => {
    setPatientSearch(search);
    if (search.trim()) {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.email.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  };

  const selectPatient = (patient: Patient) => {
    setFormData(prev => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name,
    }));
    setShowPatientSearch(false);
    setPatientSearch('');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) newErrors.patientId = 'Patient is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';

    // Check if date is in the future
    const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
    if (appointmentDateTime <= new Date()) {
      newErrors.date = 'Appointment must be scheduled for a future date and time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const appointment: Appointment = {
        id: initialData?.id || generateId(),
        patientId: formData.patientId,
        patientName: formData.patientName,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        type: formData.type,
        status: initialData?.status || 'scheduled',
        reason: formData.reason,
        notes: formData.notes || undefined,
        prescriptionIds: followUpForPrescription ? [followUpForPrescription] : undefined,
      };

      onSchedule(appointment);
      handleClose();
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      patientId: '',
      patientName: '',
      date: '',
      time: '',
      type: 'consultation',
      reason: '',
      duration: 30,
      notes: '',
    });
    setErrors({});
    setShowPatientSearch(false);
    setPatientSearch('');
    onClose();
  };

  // Generate time slots (9 AM to 5 PM in 30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white border-opacity-20">
          <h2 className="text-xl font-semibold text-fg">
            {followUpForPrescription ? 'Schedule Follow-up Appointment' : initialData ? 'Edit Appointment' : 'Schedule New Appointment'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-fg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-fg mb-2">Patient *</label>
            <div className="relative">
              <div
                className="input-field flex items-center cursor-pointer"
                onClick={() => setShowPatientSearch(!showPatientSearch)}
              >
                <User className="h-5 w-5 text-muted mr-2" />
                <span className={formData.patientName ? 'text-fg' : 'text-muted'}>
                  {formData.patientName || 'Select patient...'}
                </span>
              </div>
              {errors.patientId && <p className="text-red-400 text-sm mt-1">{errors.patientId}</p>}

              {showPatientSearch && (
                <div className="absolute top-full left-0 right-0 mt-1 glass-card max-h-60 overflow-y-auto z-10">
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={patientSearch}
                      onChange={(e) => handlePatientSearch(e.target.value)}
                      className="input-field w-full mb-2"
                    />
                    {filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className="p-3 hover:bg-white hover:bg-opacity-10 cursor-pointer rounded-theme"
                        onClick={() => selectPatient(patient)}
                      >
                        <div className="font-medium text-fg">{patient.name}</div>
                        <div className="text-sm text-muted">{patient.email}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-2">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="input-field w-full"
              />
              {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-2">Time *</label>
              <select
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="input-field w-full"
              >
                <option value="">Select time...</option>
                {timeSlots.map((slot) => {
                  const [hours, minutes] = slot.split(':');
                  const hour = parseInt(hours, 10);
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  const displayHour = hour % 12 || 12;
                  const displayTime = `${displayHour}:${minutes} ${ampm}`;
                  return (
                    <option key={slot} value={slot}>
                      {displayTime}
                    </option>
                  );
                })}
              </select>
              {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Appointment Type and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-2">Appointment Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Appointment['type'] }))}
                className="input-field w-full"
              >
                <option value="consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
                <option value="check-up">Check-up</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-2">Duration (minutes)</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="input-field w-full"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-fg mb-2">Reason for Visit *</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Describe the reason for this appointment..."
              className="input-field w-full h-24 resize-none"
            />
            {errors.reason && <p className="text-red-400 text-sm mt-1">{errors.reason}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-fg mb-2">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes or special instructions..."
              className="input-field w-full h-20 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-white border-opacity-20">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
              disabled={isSubmitting}
            >
              <Calendar className="h-5 w-5" />
              <span>{isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

