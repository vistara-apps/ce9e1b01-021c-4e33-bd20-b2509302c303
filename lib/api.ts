import { Prescription, Appointment, Patient, Pharmacy } from './types';

const API_BASE = '/api';

// Prescriptions API
export const prescriptionsApi = {
  async getAll(filters?: { patientId?: string; status?: string }): Promise<Prescription[]> {
    const params = new URLSearchParams();
    if (filters?.patientId) params.set('patientId', filters.patientId);
    if (filters?.status) params.set('status', filters.status);

    const response = await fetch(`${API_BASE}/prescriptions?${params}`);
    if (!response.ok) throw new Error('Failed to fetch prescriptions');
    return response.json();
  },

  async getById(id: string): Promise<Prescription> {
    const response = await fetch(`${API_BASE}/prescriptions/${id}`);
    if (!response.ok) throw new Error('Failed to fetch prescription');
    return response.json();
  },

  async create(data: Omit<Prescription, 'id' | 'prescribedDate' | 'status'>): Promise<Prescription> {
    const response = await fetch(`${API_BASE}/prescriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create prescription');
    return response.json();
  },

  async update(id: string, data: Partial<Prescription>): Promise<Prescription> {
    const response = await fetch(`${API_BASE}/prescriptions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update prescription');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/prescriptions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete prescription');
  },
};

// Appointments API
export const appointmentsApi = {
  async getAll(filters?: { patientId?: string; date?: string; status?: string }): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (filters?.patientId) params.set('patientId', filters.patientId);
    if (filters?.date) params.set('date', filters.date);
    if (filters?.status) params.set('status', filters.status);

    const response = await fetch(`${API_BASE}/appointments?${params}`);
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return response.json();
  },

  async getById(id: string): Promise<Appointment> {
    const response = await fetch(`${API_BASE}/appointments/${id}`);
    if (!response.ok) throw new Error('Failed to fetch appointment');
    return response.json();
  },

  async create(data: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> {
    const response = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create appointment');
    return response.json();
  },

  async update(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const response = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update appointment');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete appointment');
  },
};

// Patients API
export const patientsApi = {
  async getAll(search?: string): Promise<Patient[]> {
    const params = new URLSearchParams();
    if (search) params.set('search', search);

    const response = await fetch(`${API_BASE}/patients?${params}`);
    if (!response.ok) throw new Error('Failed to fetch patients');
    return response.json();
  },

  async getById(id: string): Promise<Patient> {
    const response = await fetch(`${API_BASE}/patients/${id}`);
    if (!response.ok) throw new Error('Failed to fetch patient');
    return response.json();
  },

  async create(data: Omit<Patient, 'id'>): Promise<Patient> {
    const response = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create patient');
    return response.json();
  },

  async update(id: string, data: Partial<Patient>): Promise<Patient> {
    const response = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update patient');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete patient');
  },
};

// Pharmacies API
export const pharmaciesApi = {
  async getAll(deliveryOnly?: boolean): Promise<Pharmacy[]> {
    const params = new URLSearchParams();
    if (deliveryOnly) params.set('deliveryOnly', 'true');

    const response = await fetch(`${API_BASE}/pharmacies?${params}`);
    if (!response.ok) throw new Error('Failed to fetch pharmacies');
    return response.json();
  },

  async create(data: Omit<Pharmacy, 'id'>): Promise<Pharmacy> {
    const response = await fetch(`${API_BASE}/pharmacies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create pharmacy');
    return response.json();
  },
};

