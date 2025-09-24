'use client';

import { useState } from 'react';
import { FileText, Truck, Clock, Calendar, Plus, Search } from 'lucide-react';

interface Prescription {
  id: string;
  patientName: string;
  medication: string;
  dosage: string;
  status: 'pending' | 'filled' | 'delivered' | 'ready';
  pharmacy: string;
  date: string;
}

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'prescriptions' | 'appointments'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const prescriptions: Prescription[] = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      medication: 'Amoxicillin 500mg',
      dosage: '3x daily for 7 days',
      status: 'delivered',
      pharmacy: 'CVS Pharmacy',
      date: '2024-01-15'
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      medication: 'Lisinopril 10mg',
      dosage: '1x daily',
      status: 'ready',
      pharmacy: 'Walgreens',
      date: '2024-01-14'
    },
    {
      id: '3',
      patientName: 'Emily Davis',
      medication: 'Metformin 500mg',
      dosage: '2x daily with meals',
      status: 'pending',
      pharmacy: 'Rite Aid',
      date: '2024-01-13'
    }
  ];

  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Robert Wilson',
      time: '2:00 PM',
      type: 'Follow-up',
      status: 'scheduled'
    },
    {
      id: '2',
      patientName: 'Lisa Anderson',
      time: '3:30 PM',
      type: 'Consultation',
      status: 'scheduled'
    },
    {
      id: '3',
      patientName: 'David Brown',
      time: '4:15 PM',
      type: 'Check-up',
      status: 'scheduled'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-400';
      case 'ready': return 'text-blue-400';
      case 'filled': return 'text-yellow-400';
      case 'pending': return 'text-orange-400';
      case 'scheduled': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const filteredPrescriptions = prescriptions.filter(p => 
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.medication.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAppointments = appointments.filter(a => 
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Today's Prescriptions</p>
                <p className="text-2xl font-bold text-fg">12</p>
              </div>
              <FileText className="h-8 w-8 text-accent" />
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Ready for Pickup</p>
                <p className="text-2xl font-bold text-fg">5</p>
              </div>
              <Clock className="h-8 w-8 text-accent" />
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Out for Delivery</p>
                <p className="text-2xl font-bold text-fg">3</p>
              </div>
              <Truck className="h-8 w-8 text-accent" />
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Upcoming Appointments</p>
                <p className="text-2xl font-bold text-fg">8</p>
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
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>New Prescription</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Schedule Appointment</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-fg">Recent Prescriptions</h2>
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
                  
                  <div className="text-right">
                    <p className={`font-medium capitalize ${getStatusColor(prescription.status)}`}>
                      {prescription.status}
                    </p>
                    <p className="text-muted text-sm">{prescription.pharmacy}</p>
                    <p className="text-muted text-xs">{prescription.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-fg">Today's Appointments</h2>
          <div className="grid gap-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="prescription-card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-fg">{appointment.patientName}</h3>
                    <p className="text-accent font-medium">{appointment.type}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-fg font-medium">{appointment.time}</p>
                    <p className={`text-sm capitalize ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
}
