export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  insuranceProvider?: string;
  allergies: string[];
  medicalHistory: string[];
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  strength: string;
  form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'cream' | 'inhaler';
  manufacturer: string;
  ndc: string; // National Drug Code
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  medicationId: string;
  medication: string;
  dosage: string;
  quantity: number;
  refills: number;
  instructions: string;
  prescribedDate: string;
  status: 'pending' | 'filled' | 'ready' | 'delivered' | 'cancelled';
  pharmacyId: string;
  pharmacy: string;
  deliveryOption: 'pickup' | 'delivery';
  deliveryAddress?: string;
  estimatedReady?: string;
  notes?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  deliveryAvailable: boolean;
  estimatedFillTime: number; // in minutes
  rating: number;
  distance?: number; // in miles
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'consultation' | 'follow-up' | 'check-up' | 'urgent';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  prescriptionIds?: string[];
}

export interface PrescriptionStatus {
  id: string;
  prescriptionId: string;
  status: Prescription['status'];
  timestamp: string;
  location?: string;
  notes?: string;
  estimatedDelivery?: string;
}

export interface HealthcareProvider {
  id: string;
  name: string;
  title: string;
  specialty: string;
  licenseNumber: string;
  npi: string; // National Provider Identifier
  address: string;
  phone: string;
  email: string;
}
