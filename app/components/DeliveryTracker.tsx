'use client';

import { useState, useEffect } from 'react';
import { MapPin, Truck, CheckCircle, Clock, Navigation } from 'lucide-react';
import { Prescription } from '@/lib/types';

interface DeliveryTrackerProps {
  prescription: Prescription;
}

interface DeliveryStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
  timestamp?: string;
  location?: string;
}

export function DeliveryTracker({ prescription }: DeliveryTrackerProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Mock delivery steps - in real app, this would come from delivery API
  const deliverySteps: DeliveryStep[] = [
    {
      id: 'packed',
      label: 'Order Packed',
      description: 'Your prescription has been packed and is ready for delivery',
      completed: ['ready', 'out-for-delivery', 'delivered'].includes(prescription.status),
      current: prescription.status === 'ready',
      timestamp: prescription.status !== 'pending' ? new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString() : undefined,
    },
    {
      id: 'picked-up',
      label: 'Picked Up by Driver',
      description: 'A delivery driver has picked up your order',
      completed: ['out-for-delivery', 'delivered'].includes(prescription.status),
      current: prescription.status === 'filled' && prescription.deliveryOption === 'delivery',
      timestamp: prescription.status === 'filled' ? new Date(Date.now() - 1 * 60 * 60 * 1000).toLocaleString() : undefined,
    },
    {
      id: 'out-for-delivery',
      label: 'Out for Delivery',
      description: 'Your order is on the way to your address',
      completed: prescription.status === 'delivered',
      current: prescription.status === 'ready' && prescription.deliveryOption === 'delivery',
      timestamp: prescription.status === 'ready' ? new Date(Date.now() - 30 * 60 * 1000).toLocaleString() : undefined,
      location: '2 miles away',
    },
    {
      id: 'delivered',
      label: 'Delivered',
      description: 'Your prescription has been delivered successfully',
      completed: prescription.status === 'delivered',
      current: prescription.status === 'delivered',
      timestamp: prescription.status === 'delivered' ? new Date().toLocaleString() : undefined,
      location: prescription.deliveryAddress,
    },
  ];

  useEffect(() => {
    // Update current step based on prescription status
    const stepIndex = deliverySteps.findIndex(step => step.current);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
    }
  }, [prescription.status]);

  if (prescription.deliveryOption !== 'delivery') {
    return (
      <div className="text-center py-8">
        <MapPin className="h-12 w-12 text-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-fg mb-2">Pickup Order</h3>
        <p className="text-muted">
          This prescription is set for pickup at {prescription.pharmacy}
        </p>
        {prescription.status === 'ready' && (
          <div className="mt-4 p-4 bg-accent bg-opacity-10 border border-accent border-opacity-20 rounded-theme">
            <p className="text-accent font-medium">Ready for pickup!</p>
            <p className="text-sm text-muted mt-1">
              Visit {prescription.pharmacy} to pick up your medication
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-fg">Delivery Tracking</h3>
        <div className="flex items-center space-x-2 text-sm text-muted">
          <Truck className="h-4 w-4" />
          <span>Estimated delivery: {prescription.estimatedReady || 'TBD'}</span>
        </div>
      </div>

      <div className="space-y-4">
        {deliverySteps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  step.completed
                    ? 'bg-green-500 text-white'
                    : step.current
                    ? 'bg-accent text-bg'
                    : 'bg-white bg-opacity-10 text-muted'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : step.current ? (
                  <Navigation className="h-5 w-5" />
                ) : (
                  <Clock className="h-5 w-5" />
                )}
              </div>
              {index < deliverySteps.length - 1 && (
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
              {step.timestamp && (
                <p className="text-xs text-muted mt-1">
                  {step.timestamp}
                </p>
              )}
              {step.location && step.current && (
                <p className="text-sm text-accent mt-1 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {step.location}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {prescription.deliveryAddress && (
        <div className="p-4 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-theme">
          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-fg">Delivery Address</h4>
              <p className="text-sm text-muted">{prescription.deliveryAddress}</p>
            </div>
          </div>
        </div>
      )}

      {prescription.status === 'delivered' && (
        <div className="p-4 bg-green-500 bg-opacity-10 border border-green-500 border-opacity-20 rounded-theme">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-medium">Delivery completed successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}

