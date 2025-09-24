import { Patient, Prescription, Appointment, Pharmacy } from './types';

export interface ValidationError {
  field: string;
  message: string;
}

export function validatePatient(patient: Partial<Patient>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!patient.name?.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (patient.name.length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  if (!patient.email?.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!patient.phone?.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(patient.phone)) {
    errors.push({ field: 'phone', message: 'Phone must be in format (XXX) XXX-XXXX' });
  }

  if (!patient.dateOfBirth) {
    errors.push({ field: 'dateOfBirth', message: 'Date of birth is required' });
  } else {
    const birthDate = new Date(patient.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 0 || age > 150) {
      errors.push({ field: 'dateOfBirth', message: 'Please enter a valid date of birth' });
    }
  }

  if (!patient.address?.trim()) {
    errors.push({ field: 'address', message: 'Address is required' });
  }

  return errors;
}

export function validatePrescription(prescription: Partial<Prescription>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!prescription.patientId) {
    errors.push({ field: 'patientId', message: 'Patient is required' });
  }

  if (!prescription.medication?.trim()) {
    errors.push({ field: 'medication', message: 'Medication is required' });
  }

  if (!prescription.dosage?.trim()) {
    errors.push({ field: 'dosage', message: 'Dosage instructions are required' });
  }

  if (!prescription.instructions?.trim()) {
    errors.push({ field: 'instructions', message: 'Instructions are required' });
  }

  if (prescription.quantity !== undefined && prescription.quantity <= 0) {
    errors.push({ field: 'quantity', message: 'Quantity must be greater than 0' });
  }

  if (prescription.refills !== undefined && prescription.refills < 0) {
    errors.push({ field: 'refills', message: 'Refills cannot be negative' });
  }

  if (!prescription.pharmacyId) {
    errors.push({ field: 'pharmacyId', message: 'Pharmacy selection is required' });
  }

  if (prescription.deliveryOption === 'delivery' && !prescription.deliveryAddress?.trim()) {
    errors.push({ field: 'deliveryAddress', message: 'Delivery address is required for delivery' });
  }

  return errors;
}

export function validateAppointment(appointment: Partial<Appointment>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!appointment.patientId) {
    errors.push({ field: 'patientId', message: 'Patient is required' });
  }

  if (!appointment.date) {
    errors.push({ field: 'date', message: 'Date is required' });
  } else {
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time || '00:00'}`);
    if (appointmentDateTime <= new Date()) {
      errors.push({ field: 'date', message: 'Appointment must be scheduled for a future date and time' });
    }
  }

  if (!appointment.time) {
    errors.push({ field: 'time', message: 'Time is required' });
  }

  if (!appointment.reason?.trim()) {
    errors.push({ field: 'reason', message: 'Reason for visit is required' });
  }

  if (appointment.duration !== undefined && appointment.duration <= 0) {
    errors.push({ field: 'duration', message: 'Duration must be greater than 0 minutes' });
  }

  return errors;
}

export function validatePharmacy(pharmacy: Partial<Pharmacy>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!pharmacy.name?.trim()) {
    errors.push({ field: 'name', message: 'Pharmacy name is required' });
  }

  if (!pharmacy.address?.trim()) {
    errors.push({ field: 'address', message: 'Address is required' });
  }

  if (!pharmacy.phone?.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  }

  if (!pharmacy.hours?.trim()) {
    errors.push({ field: 'hours', message: 'Hours of operation are required' });
  }

  if (pharmacy.estimatedFillTime !== undefined && pharmacy.estimatedFillTime <= 0) {
    errors.push({ field: 'estimatedFillTime', message: 'Fill time must be greater than 0 minutes' });
  }

  if (pharmacy.rating !== undefined && (pharmacy.rating < 0 || pharmacy.rating > 5)) {
    errors.push({ field: 'rating', message: 'Rating must be between 0 and 5' });
  }

  return errors;
}

// Utility function to format validation errors for display
export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map(error => `${error.field}: ${error.message}`).join('\n');
}

// Utility function to check if an object has validation errors
export function hasValidationErrors(errors: ValidationError[]): boolean {
  return errors.length > 0;
}

