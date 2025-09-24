'use client';

import { useState, useEffect } from 'react';
import { Search, User, Phone, Mail, MapPin } from 'lucide-react';
import { Patient } from '@/lib/types';
import { patientsApi } from '@/lib/api';
import { calculateAge } from '@/lib/utils';

interface PatientSelectorProps {
  onSelect: (patient: Patient) => void;
  placeholder?: string;
}

export function PatientSelector({ onSelect, placeholder = "Search patients..." }: PatientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients.slice(0, 10)); // Show first 10 by default
    }
  }, [searchTerm, patients]);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const patientsData = await patientsApi.getAll();
      setPatients(patientsData);
      setFilteredPatients(patientsData.slice(0, 10));
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (patient: Patient) => {
    onSelect(patient);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="input-field pl-10 w-full"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 glass-card max-h-80 overflow-y-auto z-50">
          <div className="p-2">
            {isLoading ? (
              <div className="p-4 text-center text-muted">
                Loading patients...
              </div>
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-3 hover:bg-white hover:bg-opacity-10 cursor-pointer rounded-theme transition-colors"
                  onClick={() => handleSelect(patient)}
                >
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-fg">{patient.name}</div>
                      <div className="text-sm text-muted">
                        Age: {calculateAge(patient.dateOfBirth)}
                      </div>
                      <div className="flex items-center text-sm text-muted mt-1">
                        <Mail className="h-4 w-4 mr-1" />
                        {patient.email}
                      </div>
                      <div className="flex items-center text-sm text-muted mt-1">
                        <Phone className="h-4 w-4 mr-1" />
                        {patient.phone}
                      </div>
                      <div className="flex items-center text-sm text-muted mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {patient.address}
                      </div>
                      {patient.allergies.length > 0 && (
                        <div className="text-sm text-orange-400 mt-1">
                          Allergies: {patient.allergies.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted">
                {searchTerm ? `No patients found matching "${searchTerm}"` : 'No patients available'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

