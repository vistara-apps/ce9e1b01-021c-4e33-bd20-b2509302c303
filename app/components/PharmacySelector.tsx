'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Star, Truck } from 'lucide-react';
import { Pharmacy } from '@/lib/types';
import { pharmaciesApi } from '@/lib/api';

interface PharmacySelectorProps {
  onSelect: (pharmacy: Pharmacy) => void;
  selectedPharmacyId?: string;
  deliveryOnly?: boolean;
}

export function PharmacySelector({ onSelect, selectedPharmacyId, deliveryOnly = false }: PharmacySelectorProps) {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPharmacies();
  }, [deliveryOnly]);

  const loadPharmacies = async () => {
    setIsLoading(true);
    try {
      const pharmaciesData = await pharmaciesApi.getAll(deliveryOnly);
      setPharmacies(pharmaciesData);
    } catch (error) {
      console.error('Error loading pharmacies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-4 animate-pulse">
            <div className="h-4 bg-white bg-opacity-20 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white bg-opacity-20 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pharmacies.map((pharmacy) => (
        <div
          key={pharmacy.id}
          className={`p-4 border rounded-theme cursor-pointer transition-all ${
            selectedPharmacyId === pharmacy.id
              ? 'border-accent bg-accent bg-opacity-10'
              : 'border-white border-opacity-20 hover:bg-white hover:bg-opacity-5 glass-card'
          }`}
          onClick={() => onSelect(pharmacy)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-fg">{pharmacy.name}</h3>
                <div className="flex items-center text-sm text-muted">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  {pharmacy.rating}
                </div>
              </div>

              <div className="flex items-start space-x-2 text-sm text-muted mb-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{pharmacy.address}</span>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center text-accent">
                  <Clock className="h-4 w-4 mr-1" />
                  ~{pharmacy.estimatedFillTime}min fill time
                </div>

                {pharmacy.deliveryAvailable && (
                  <div className="flex items-center text-green-400">
                    <Truck className="h-4 w-4 mr-1" />
                    Delivery available
                  </div>
                )}
              </div>

              <div className="text-xs text-muted mt-2">
                {pharmacy.hours}
              </div>
            </div>
          </div>
        </div>
      ))}

      {pharmacies.length === 0 && (
        <div className="text-center py-8 text-muted">
          {deliveryOnly ? 'No pharmacies with delivery available' : 'No pharmacies available'}
        </div>
      )}
    </div>
  );
}

