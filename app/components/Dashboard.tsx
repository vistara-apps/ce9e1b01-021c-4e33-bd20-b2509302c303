'use client';

import { useState, useEffect } from 'react';
import { FileText, Truck, Clock, Calendar, Plus, Search, Eye, Edit } from 'lucide-react';
import { Prescription, Appointment } from '@/lib/types';
import { prescriptionsApi, appointmentsApi } from '@/lib/api';
import { PrescriptionForm } from './PrescriptionForm';
import { AppointmentScheduler } from './AppointmentScheduler';
import { StatusTracker } from './StatusTracker';
import { DeliveryTracker } from './DeliveryTracker';
import { PatientProfile } from './PatientProfile';
import { getStatusColor, formatDate, formatTime } from '@/lib/utils';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'prescriptions' | 'appointments'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showAppointmentScheduler, setShowAppointmentScheduler] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showPatientProfile, setShowPatientProfile] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prescriptionsData, appointmentsData] = await Promise.all([
        prescriptionsApi.getAll(),
        appointmentsApi.getAll(),
      ]);
      setPrescriptions(prescriptionsData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePrescription = async (prescription: Prescription) => {
    try {
      await prescriptionsApi.create(prescription);
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Error creating prescription:', error);
    }
  };

  const handleScheduleAppointment = async (appointment: Appointment) => {
    try {
      await appointmentsApi.create(appointment);
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    }
  };

  const handleStatusUpdate = async (prescriptionId: string, newStatus: Prescription['status']) => {
    try {
      await prescriptionsApi.update(prescriptionId, { status: newStatus });
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Error updating prescription status:', error);
    }
  };

  const filteredPrescriptions = prescriptions.filter(p =>
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.pharmacy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAppointments = appointments.filter(a =>
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStats = () => {
    const todayPrescriptions = prescriptions.filter(p => {
      const today = new Date().toISOString().split('T')[0];
      return p.prescribedDate.startsWith(today);
    });

    const readyForPickup = prescriptions.filter(p => p.status === 'ready' && p.deliveryOption === 'pickup').length;
    const outForDelivery = prescriptions.filter(p => p.status === 'ready' && p.deliveryOption === 'delivery').length;
    const todayAppointments = appointments.filter(a => {
      const today = new Date().toISOString().split('T')[0];
      return a.date === today;
    });

    return {
      todayPrescriptions: todayPrescriptions.length,
      readyForPickup,
      outForDelivery,
      todayAppointments: todayAppointments.length,
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Today's Prescriptions</p>
                <p className="text-2xl font-bold text-fg">{isLoading ? '...' : stats.todayPrescriptions}</p>
              </div>
              <FileText className="h-8 w-8 text-accent" />
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Ready for Pickup</p>
                <p className="text-2xl font-bold text-fg">{isLoading ? '...' : stats.readyForPickup}</p>
              </div>
              <Clock className="h-8 w-8 text-accent" />
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Out for Delivery</p>
                <p className="text-2xl font-bold text-fg">{isLoading ? '...' : stats.outForDelivery}</p>
              </div>
              <Truck className="h-8 w-8 text-accent" />
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Today's Appointments</p>
                <p className="text-2xl font-bold text-fg">{isLoading ? '...' : stats.todayAppointments}</p>
              </div>
              <Calendar className="h-8 w-8 text-accent" />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white bg-opacity-10 p-1 rounded-theme">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-4 rounded-theme transition-all duration-200 ${
            activeTab === 'overview' 
              ? 'bg-accent text-bg font-medium' 
              : 'text-fg hover:bg-white hover:bg-opacity-10'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`flex-1 py-2 px-4 rounded-theme transition-all duration-200 ${
            activeTab === 'prescriptions' 
              ? 'bg-accent text-bg font-medium' 
              : 'text-fg hover:bg-white hover:bg-opacity-10'
          }`}
        >
          Prescriptions
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex-1 py-2 px-4 rounded-theme transition-all duration-200 ${
            activeTab === 'appointments' 
              ? 'bg-accent text-bg font-medium' 
              : 'text-fg hover:bg-white hover:bg-opacity-10'
          }`}
        >
          Appointments
        </button>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
          <input
            type="text"
            placeholder="Search patients, medications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPrescriptionForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Prescription</span>
          </button>
          <button
            onClick={() => setShowAppointmentScheduler(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Calendar className="h-5 w-5" />
            <span>Schedule Appointment</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-fg">Prescriptions</h2>
          {isLoading ? (
            <div className="text-center py-8 text-muted">Loading prescriptions...</div>
          ) : (
            <div className="grid gap-4">
              {filteredPrescriptions.map((prescription) => (
                <div key={prescription.id} className="prescription-card">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="font-semibold text-fg">{prescription.patientName}</h3>
                          <p className="text-accent font-medium">{prescription.medication}</p>
                          <p className="text-muted text-sm">{prescription.dosage}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`font-medium capitalize ${getStatusColor(prescription.status)}`}>
                          {prescription.status}
                        </p>
                        <p className="text-muted text-sm">{prescription.pharmacy}</p>
                        <p className="text-muted text-xs">{formatDate(prescription.prescribedDate)}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedPrescription(prescription)}
                          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
                          title="View details"
                        >
                          <Eye className="h-4 w-4 text-fg" />
                        </button>
                        <button
                          onClick={() => setShowPatientProfile(prescription.patientId)}
                          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
                          title="View patient"
                        >
                          <FileText className="h-4 w-4 text-fg" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredPrescriptions.length === 0 && (
                <div className="text-center py-8 text-muted">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No prescriptions found</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-fg">Appointments</h2>
          {isLoading ? (
            <div className="text-center py-8 text-muted">Loading appointments...</div>
          ) : (
            <div className="grid gap-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="prescription-card">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-fg">{appointment.patientName}</h3>
                      <p className="text-accent font-medium">{appointment.type}</p>
                      <p className="text-muted text-sm">{appointment.reason}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-fg font-medium">{formatDate(appointment.date)}</p>
                        <p className="text-fg text-sm">{formatTime(appointment.time)}</p>
                        <p className={`text-sm capitalize ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedAppointment(appointment)}
                          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
                          title="View details"
                        >
                          <Eye className="h-4 w-4 text-fg" />
                        </button>
                        <button
                          onClick={() => setShowPatientProfile(appointment.patientId)}
                          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
                          title="View patient"
                        >
                          <FileText className="h-4 w-4 text-fg" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredAppointments.length === 0 && (
                <div className="text-center py-8 text-muted">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No appointments found</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Prescriptions */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-fg mb-4">Recent Prescriptions</h2>
            <div className="space-y-3">
              {prescriptions.slice(0, 3).map((prescription) => (
                <div key={prescription.id} className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-theme">
                  <div>
                    <p className="font-medium text-fg">{prescription.patientName}</p>
                    <p className="text-accent text-sm">{prescription.medication}</p>
                  </div>
                  <span className={`text-sm capitalize ${getStatusColor(prescription.status)}`}>
                    {prescription.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-fg mb-4">Upcoming Appointments</h2>
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-theme">
                  <div>
                    <p className="font-medium text-fg">{appointment.patientName}</p>
                    <p className="text-accent text-sm">{appointment.type}</p>
                  </div>
                  <span className="text-fg text-sm">{appointment.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <PrescriptionForm
        isOpen={showPrescriptionForm}
        onClose={() => setShowPrescriptionForm(false)}
        onSubmit={handleCreatePrescription}
      />

      <AppointmentScheduler
        isOpen={showAppointmentScheduler}
        onClose={() => setShowAppointmentScheduler(false)}
        onSchedule={handleScheduleAppointment}
      />

      {/* Prescription Details Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white border-opacity-20">
              <h2 className="text-xl font-semibold text-fg">Prescription Details</h2>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-fg" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-fg mb-2">Patient Information</h3>
                    <div className="glass-card p-4">
                      <p className="font-medium text-fg">{selectedPrescription.patientName}</p>
                      <p className="text-accent">{selectedPrescription.medication}</p>
                      <p className="text-muted text-sm mt-2">{selectedPrescription.dosage}</p>
                      <p className="text-muted text-sm">Quantity: {selectedPrescription.quantity}</p>
                      {selectedPrescription.refills > 0 && (
                        <p className="text-muted text-sm">Refills: {selectedPrescription.refills}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-fg mb-2">Pharmacy & Delivery</h3>
                    <div className="glass-card p-4">
                      <p className="font-medium text-fg">{selectedPrescription.pharmacy}</p>
                      <p className="text-accent capitalize">{selectedPrescription.deliveryOption}</p>
                      {selectedPrescription.deliveryAddress && (
                        <p className="text-muted text-sm mt-2">{selectedPrescription.deliveryAddress}</p>
                      )}
                      {selectedPrescription.estimatedReady && (
                        <p className="text-muted text-sm">Estimated: {selectedPrescription.estimatedReady}</p>
                      )}
                    </div>
                  </div>

                  {selectedPrescription.instructions && (
                    <div>
                      <h3 className="text-lg font-medium text-fg mb-2">Instructions</h3>
                      <div className="glass-card p-4">
                        <p className="text-fg">{selectedPrescription.instructions}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <StatusTracker
                    prescription={selectedPrescription}
                    onStatusUpdate={handleStatusUpdate}
                  />
                  {selectedPrescription.deliveryOption === 'delivery' && (
                    <div className="mt-6">
                      <DeliveryTracker prescription={selectedPrescription} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-white border-opacity-20">
              <h2 className="text-xl font-semibold text-fg">Appointment Details</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-fg" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium text-fg mb-2">Patient</h3>
                  <p className="text-fg font-medium">{selectedAppointment.patientName}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-fg mb-2">Date & Time</h3>
                  <p className="text-fg">{formatDate(selectedAppointment.date)}</p>
                  <p className="text-accent">{formatTime(selectedAppointment.time)}</p>
                  <p className="text-muted text-sm">Duration: {selectedAppointment.duration} minutes</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-fg mb-2">Appointment Type</h3>
                <p className="text-accent capitalize">{selectedAppointment.type}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-fg mb-2">Reason</h3>
                <p className="text-fg">{selectedAppointment.reason}</p>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <h3 className="text-lg font-medium text-fg mb-2">Notes</h3>
                  <p className="text-fg">{selectedAppointment.notes}</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium text-fg mb-2">Status</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAppointment.status)} bg-opacity-20`}>
                  {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Profile Modal */}
      {showPatientProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <PatientProfile
              patientId={showPatientProfile}
              onClose={() => setShowPatientProfile(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
