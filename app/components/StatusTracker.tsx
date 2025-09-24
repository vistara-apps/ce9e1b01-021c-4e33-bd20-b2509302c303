'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Truck, Package, AlertCircle } from 'lucide-react';
import { Prescription } from '@/lib/types';
import { getStatusColor } from '@/lib/utils';

interface StatusTrackerProps {
  prescription: Prescription;
  onStatusUpdate?: (prescriptionId: string, newStatus: Prescription['status']) => void;
}

interface StatusStep {
  status: Prescription['status'];
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
  current: boolean;
}

export function StatusTracker({ prescription, onStatusUpdate }: StatusTrackerProps) {
  const [currentStatus, setCurrentStatus] = useState<Prescription['status']>(prescription.status);

  useEffect(() => {
    setCurrentStatus(prescription.status);
  }, [prescription.status]);

  const statusSteps: StatusStep[] = [
    {
      status: 'pending',
      label: 'Prescription Submitted',
      description: 'Prescription has been sent to pharmacy',
      icon: Clock,
      completed: ['filled', 'ready', 'delivered'].includes(currentStatus),
      current: currentStatus === 'pending',
    },
    {
      status: 'filled',
      label: 'Filled by Pharmacy',
      description: 'Pharmacy has prepared the medication',
      icon: Package,
      completed: ['ready', 'delivered'].includes(currentStatus),
      current: currentStatus === 'filled',
    },
    {
      status: 'ready',
      label: 'Ready for Pickup/Delivery',
      description: prescription.deliveryOption === 'delivery'
        ? 'Ready for delivery to your address'
        : 'Ready for pickup at pharmacy',
      icon: Truck,
      completed: currentStatus === 'delivered',
      current: currentStatus === 'ready',
    },
    {
      status: 'delivered',
      label: prescription.deliveryOption === 'delivery' ? 'Delivered' : 'Picked Up',
      description: prescription.deliveryOption === 'delivery'
        ? 'Medication delivered to your address'
        : 'Medication picked up successfully',
      icon: CheckCircle,
      completed: currentStatus === 'delivered',
      current: currentStatus === 'delivered',
    },
  ];

  const handleStatusClick = (newStatus: Prescription['status']) => {
    if (onStatusUpdate) {
      onStatusUpdate(prescription.id, newStatus);
      setCurrentStatus(newStatus);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-fg">Prescription Status</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)} bg-opacity-20`}>
          {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
        </div>
      </div>

      <div className="space-y-4">
        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.status} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    step.completed
                      ? 'bg-green-500 text-white'
                      : step.current
                      ? 'bg-accent text-bg'
                      : 'bg-white bg-opacity-10 text-muted'
                  } ${onStatusUpdate ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
                  onClick={() => onStatusUpdate && handleStatusClick(step.status)}
                  title={onStatusUpdate ? `Click to mark as ${step.status}` : undefined}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {index < statusSteps.length - 1 && (
                  <div
                    className={`w-0.5 h-8 mt-2 transition-colors ${
                      step.completed ? 'bg-green-500' : 'bg-white bg-opacity-20'
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 pb-4">
                <div className="flex items-center space-x-2">
                  <h4 className={`font-medium ${step.completed || step.current ? 'text-fg' : 'text-muted'}`}>
                    {step.label}
                  </h4>
                  {step.current && (
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  )}
                </div>
                <p className={`text-sm mt-1 ${step.completed || step.current ? 'text-fg' : 'text-muted'}`}>
                  {step.description}
                </p>
                {step.status === 'ready' && prescription.estimatedReady && (
                  <p className="text-sm text-accent mt-1">
                    Estimated {prescription.deliveryOption === 'delivery' ? 'delivery' : 'pickup'}: {prescription.estimatedReady}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {currentStatus === 'cancelled' && (
        <div className="flex items-center space-x-2 p-3 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-theme">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <span className="text-red-400 text-sm">This prescription has been cancelled</span>
        </div>
      )}

      {prescription.notes && (
        <div className="p-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-theme">
          <h4 className="text-sm font-medium text-fg mb-1">Notes</h4>
          <p className="text-sm text-muted">{prescription.notes}</p>
        </div>
      )}
    </div>
  );
}

