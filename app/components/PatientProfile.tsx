'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, AlertTriangle, FileText, Edit, Save, X } from 'lucide-react';
import { Patient } from '@/lib/types';
import { patientsApi } from '@/lib/api';
import { calculateAge, formatDate } from '@/lib/utils';

interface PatientProfileProps {
  patientId: string;
  onClose?: () => void;
  onUpdate?: (patient: Patient) => void;
}

export function PatientProfile({ patientId, onClose, onUpdate }: PatientProfileProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Patient>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  const loadPatient = async () => {
    setIsLoading(true);
    try {
      const patientData = await patientsApi.getById(patientId);
      setPatient(patientData);
      setEditForm(patientData);
    } catch (error) {
      console.error('Error loading patient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!patient) return;

    setIsSaving(true);
    try {
      const updatedPatient = await patientsApi.update(patientId, editForm);
      setPatient(updatedPatient);
      setIsEditing(false);
      onUpdate?.(updatedPatient);
    } catch (error) {
      console.error('Error updating patient:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm(patient || {});
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white bg-opacity-20 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white bg-opacity-20 rounded w-full"></div>
            <div className="h-4 bg-white bg-opacity-20 rounded w-3/4"></div>
            <div className="h-4 bg-white bg-opacity-20 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="glass-card p-6 text-center">
        <User className="h-12 w-12 text-muted mx-auto mb-4" />
        <p className="text-muted">Patient not found</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-accent rounded-full">
            <User className="h-6 w-6 text-bg" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-fg">{patient.name}</h2>
            <p className="text-muted text-sm">
              Age: {calculateAge(patient.dateOfBirth)} • Patient ID: {patient.id.slice(0, 8)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
              title="Edit patient"
            >
              <Edit className="h-5 w-5 text-fg" />
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
                title="Save changes"
              >
                <Save className="h-5 w-5 text-green-400" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
                title="Cancel editing"
              >
                <X className="h-5 w-5 text-red-400" />
              </button>
            </>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
              title="Close"
            >
              <X className="h-5 w-5 text-fg" />
            </button>
          )}
        </div>
      </div>

      {/* Patient Information */}
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-fg mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted" />
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="input-field flex-1"
                    placeholder="Email address"
                  />
                ) : (
                  <span className="text-fg">{patient.email}</span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="input-field flex-1"
                    placeholder="Phone number"
                  />
                ) : (
                  <span className="text-fg">{patient.phone}</span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted" />
                <span className="text-fg">
                  Born: {formatDate(patient.dateOfBirth)}
                </span>
              </div>

              {patient.insuranceProvider && (
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.insuranceProvider || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, insuranceProvider: e.target.value }))}
                      className="input-field flex-1"
                      placeholder="Insurance provider"
                    />
                  ) : (
                    <span className="text-fg">{patient.insuranceProvider}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-lg font-medium text-fg mb-4">Address</h3>
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-muted mt-0.5" />
            {isEditing ? (
              <textarea
                value={editForm.address || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                className="input-field flex-1 h-20 resize-none"
                placeholder="Full address"
              />
            ) : (
              <span className="text-fg">{patient.address}</span>
            )}
          </div>
        </div>

        {/* Allergies */}
        {patient.allergies.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-fg mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-400 mr-2" />
              Allergies
            </h3>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((allergy, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-500 bg-opacity-20 text-orange-400 rounded-full text-sm"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Medical History */}
        {patient.medicalHistory.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-fg mb-4">Medical History</h3>
            <div className="space-y-2">
              {patient.medicalHistory.map((condition, index) => (
                <div
                  key={index}
                  className="p-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-theme"
                >
                  <p className="text-fg">{condition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty States */}
        {patient.allergies.length === 0 && patient.medicalHistory.length === 0 && (
          <div className="text-center py-8 text-muted">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No additional medical information recorded</p>
          </div>
        )}
      </div>
    </div>
  );
}

