'use client';

import { useState, useEffect } from 'react';
import { X, Search, Plus, Pill, User, MapPin, Clock } from 'lucide-react';
import { Patient, Medication, Pharmacy, Prescription } from '@/lib/types';
import { patientsApi, pharmaciesApi } from '@/lib/api';
import { COMMON_MEDICATIONS } from '@/lib/constants';
import { generateId, estimateDeliveryTime } from '@/lib/utils';

interface PrescriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prescription: Prescription) => void;
  initialData?: Partial<Prescription>;
}

export function PrescriptionForm({ isOpen, onClose, onSubmit, initialData }: PrescriptionFormProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    medicationId: '',
    medication: '',
    dosage: '',
    quantity: 30,
    refills: 0,
    instructions: '',
    pharmacyId: '',
    pharmacy: '',
    deliveryOption: 'pickup' as 'pickup' | 'delivery',
    deliveryAddress: '',
    notes: '',
  });

  const [patients, setPatients] = useState<Patient[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [filteredMedications, setFilteredMedications] = useState(COMMON_MEDICATIONS);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [showMedicationSearch, setShowMedicationSearch] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [medicationSearch, setMedicationSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (initialData) {
        setFormData(prev => ({ ...prev, ...initialData }));
      }
    }
  }, [isOpen, initialData]);

  const loadData = async () => {
    try {
      const [patientsData, pharmaciesData] = await Promise.all([
        patientsApi.getAll(),
        pharmaciesApi.getAll(),
      ]);
      setPatients(patientsData);
      setPharmacies(pharmaciesData);
      setFilteredPatients(patientsData);
    } catch (error) {
      console.error('Error loading data:', error);
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

  const handleMedicationSearch = (search: string) => {
    setMedicationSearch(search);
    if (search.trim()) {
      const filtered = COMMON_MEDICATIONS.filter(med =>
        med.name.toLowerCase().includes(search.toLowerCase()) ||
        med.genericName?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredMedications(filtered);
    } else {
      setFilteredMedications(COMMON_MEDICATIONS);
    }
  };

  const selectPatient = (patient: Patient) => {
    setFormData(prev => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name,
      deliveryAddress: patient.address,
    }));
    setShowPatientSearch(false);
    setPatientSearch('');
  };

  const selectMedication = (medication: Medication) => {
    setFormData(prev => ({
      ...prev,
      medicationId: medication.id,
      medication: medication.name,
    }));
    setShowMedicationSearch(false);
    setMedicationSearch('');
  };

  const selectPharmacy = (pharmacy: Pharmacy) => {
    setFormData(prev => ({
      ...prev,
      pharmacyId: pharmacy.id,
      pharmacy: pharmacy.name,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) newErrors.patientId = 'Patient is required';
    if (!formData.medication) newErrors.medication = 'Medication is required';
    if (!formData.dosage) newErrors.dosage = 'Dosage is required';
    if (!formData.instructions) newErrors.instructions = 'Instructions are required';
    if (!formData.pharmacyId) newErrors.pharmacyId = 'Pharmacy is required';
    if (formData.deliveryOption === 'delivery' && !formData.deliveryAddress) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const selectedPharmacy = pharmacies.find(p => p.id === formData.pharmacyId);
      const estimatedReady = selectedPharmacy
        ? estimateDeliveryTime(selectedPharmacy.estimatedFillTime, formData.deliveryOption)
        : undefined;

      const prescription: Prescription = {
        id: initialData?.id || generateId(),
        patientId: formData.patientId,
        patientName: formData.patientName,
        medicationId: formData.medicationId,
        medication: formData.medication,
        dosage: formData.dosage,
        quantity: formData.quantity,
        refills: formData.refills,
        instructions: formData.instructions,
        prescribedDate: initialData?.prescribedDate || new Date().toISOString(),
        status: initialData?.status || 'pending',
        pharmacyId: formData.pharmacyId,
        pharmacy: formData.pharmacy,
        deliveryOption: formData.deliveryOption,
        deliveryAddress: formData.deliveryOption === 'delivery' ? formData.deliveryAddress : undefined,
        estimatedReady,
        notes: formData.notes || undefined,
      };

      onSubmit(prescription);
      handleClose();
    } catch (error) {
      console.error('Error submitting prescription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      patientId: '',
      patientName: '',
      medicationId: '',
      medication: '',
      dosage: '',
      quantity: 30,
      refills: 0,
      instructions: '',
      pharmacyId: '',
      pharmacy: '',
      deliveryOption: 'pickup',
      deliveryAddress: '',
      notes: '',
    });
    setErrors({});
    setShowPatientSearch(false);
    setShowMedicationSearch(false);
    setPatientSearch('');
    setMedicationSearch('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white border-opacity-20">
          <h2 className="text-xl font-semibold text-fg">
            {initialData ? 'Edit Prescription' : 'Create New Prescription'}
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

          {/* Medication Selection */}
          <div>
            <label className="block text-sm font-medium text-fg mb-2">Medication *</label>
            <div className="relative">
              <div
                className="input-field flex items-center cursor-pointer"
                onClick={() => setShowMedicationSearch(!showMedicationSearch)}
              >
                <Pill className="h-5 w-5 text-muted mr-2" />
                <span className={formData.medication ? 'text-fg' : 'text-muted'}>
                  {formData.medication || 'Select medication...'}
                </span>
              </div>
              {errors.medication && <p className="text-red-400 text-sm mt-1">{errors.medication}</p>}

              {showMedicationSearch && (
                <div className="absolute top-full left-0 right-0 mt-1 glass-card max-h-60 overflow-y-auto z-10">
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Search medications..."
                      value={medicationSearch}
                      onChange={(e) => handleMedicationSearch(e.target.value)}
                      className="input-field w-full mb-2"
                    />
                    {filteredMedications.map((medication) => (
                      <div
                        key={medication.id}
                        className="p-3 hover:bg-white hover:bg-opacity-10 cursor-pointer rounded-theme"
                        onClick={() => selectMedication(medication)}
                      >
                        <div className="font-medium text-fg">{medication.name}</div>
                        <div className="text-sm text-accent">{medication.strength} {medication.form}</div>
                        {medication.genericName && (
                          <div className="text-sm text-muted">Generic: {medication.genericName}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dosage and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-2">Dosage *</label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="e.g., 1 tablet twice daily"
                className="input-field w-full"
              />
              {errors.dosage && <p className="text-red-400 text-sm mt-1">{errors.dosage}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-2">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                className="input-field w-full"
                min="1"
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-fg mb-2">Instructions *</label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Detailed instructions for the patient..."
              className="input-field w-full h-24 resize-none"
            />
            {errors.instructions && <p className="text-red-400 text-sm mt-1">{errors.instructions}</p>}
          </div>

          {/* Pharmacy Selection */}
          <div>
            <label className="block text-sm font-medium text-fg mb-2">Pharmacy *</label>
            <div className="grid gap-2">
              {pharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  className={`p-3 border rounded-theme cursor-pointer transition-all ${
                    formData.pharmacyId === pharmacy.id
                      ? 'border-accent bg-accent bg-opacity-10'
                      : 'border-white border-opacity-20 hover:bg-white hover:bg-opacity-5'
                  }`}
                  onClick={() => selectPharmacy(pharmacy)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-fg">{pharmacy.name}</div>
                      <div className="text-sm text-muted">{pharmacy.address}</div>
                      <div className="text-sm text-accent flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        ~{pharmacy.estimatedFillTime}min fill time
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted">Rating: {pharmacy.rating}⭐</div>
                      {pharmacy.deliveryAvailable && (
                        <div className="text-sm text-green-400">🚚 Delivery available</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.pharmacyId && <p className="text-red-400 text-sm mt-1">{errors.pharmacyId}</p>}
          </div>

          {/* Delivery Options */}
          <div>
            <label className="block text-sm font-medium text-fg mb-2">Delivery Option</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="pickup"
                  checked={formData.deliveryOption === 'pickup'}
                  onChange={(e) => setFormData(prev => ({ ...prev, deliveryOption: e.target.value as 'pickup' | 'delivery' }))}
                  className="mr-2"
                />
                <span className="text-fg">Pickup</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="delivery"
                  checked={formData.deliveryOption === 'delivery'}
                  onChange={(e) => setFormData(prev => ({ ...prev, deliveryOption: e.target.value as 'pickup' | 'delivery' }))}
                  className="mr-2"
                />
                <span className="text-fg">Delivery</span>
              </label>
            </div>
          </div>

          {/* Delivery Address */}
          {formData.deliveryOption === 'delivery' && (
            <div>
              <label className="block text-sm font-medium text-fg mb-2">Delivery Address *</label>
              <textarea
                value={formData.deliveryAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                placeholder="Enter delivery address..."
                className="input-field w-full h-20 resize-none"
              />
              {errors.deliveryAddress && <p className="text-red-400 text-sm mt-1">{errors.deliveryAddress}</p>}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-fg mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes..."
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
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : initialData ? 'Update Prescription' : 'Create Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

