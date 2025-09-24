'use client';

import { useState, useEffect } from 'react';
import { Search, Pill } from 'lucide-react';
import { Medication } from '@/lib/types';
import { COMMON_MEDICATIONS } from '@/lib/constants';

interface MedicationSearchProps {
  onSelect: (medication: Medication) => void;
  placeholder?: string;
}

export function MedicationSearch({ onSelect, placeholder = "Search medications..." }: MedicationSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>(COMMON_MEDICATIONS);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = COMMON_MEDICATIONS.filter(med =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.strength.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMedications(filtered);
    } else {
      setFilteredMedications(COMMON_MEDICATIONS.slice(0, 10)); // Show first 10 by default
    }
  }, [searchTerm]);

  const handleSelect = (medication: Medication) => {
    onSelect(medication);
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
            {filteredMedications.length > 0 ? (
              filteredMedications.map((medication) => (
                <div
                  key={medication.id}
                  className="p-3 hover:bg-white hover:bg-opacity-10 cursor-pointer rounded-theme transition-colors"
                  onClick={() => handleSelect(medication)}
                >
                  <div className="flex items-start space-x-3">
                    <Pill className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-fg truncate">{medication.name}</div>
                      <div className="text-sm text-accent">
                        {medication.strength} {medication.form}
                      </div>
                      {medication.genericName && medication.genericName !== medication.name && (
                        <div className="text-sm text-muted">
                          Generic: {medication.genericName}
                        </div>
                      )}
                      <div className="text-xs text-muted mt-1">
                        {medication.manufacturer}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted">
                No medications found matching "{searchTerm}"
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

