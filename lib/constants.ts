export const PRESCRIPTION_STATUSES = {
  PENDING: 'pending',
  FILLED: 'filled',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const APPOINTMENT_TYPES = {
  CONSULTATION: 'consultation',
  FOLLOW_UP: 'follow-up',
  CHECK_UP: 'check-up',
  URGENT: 'urgent',
} as const;

export const APPOINTMENT_STATUSES = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
} as const;

export const MEDICATION_FORMS = {
  TABLET: 'tablet',
  CAPSULE: 'capsule',
  LIQUID: 'liquid',
  INJECTION: 'injection',
  CREAM: 'cream',
  INHALER: 'inhaler',
} as const;

export const DELIVERY_OPTIONS = {
  PICKUP: 'pickup',
  DELIVERY: 'delivery',
} as const;

export const COMMON_MEDICATIONS = [
  {
    id: '1',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    strength: '500mg',
    form: 'capsule',
    manufacturer: 'Generic',
    ndc: '12345-678-90',
  },
  {
    id: '2',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    strength: '10mg',
    form: 'tablet',
    manufacturer: 'Generic',
    ndc: '12345-678-91',
  },
  {
    id: '3',
    name: 'Metformin',
    genericName: 'Metformin HCl',
    strength: '500mg',
    form: 'tablet',
    manufacturer: 'Generic',
    ndc: '12345-678-92',
  },
  {
    id: '4',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    strength: '20mg',
    form: 'tablet',
    manufacturer: 'Generic',
    ndc: '12345-678-93',
  },
  {
    id: '5',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    strength: '20mg',
    form: 'capsule',
    manufacturer: 'Generic',
    ndc: '12345-678-94',
  },
] as const;

export const SAMPLE_PHARMACIES = [
  {
    id: '1',
    name: 'CVS Pharmacy',
    address: '123 Main St, Anytown, ST 12345',
    phone: '(555) 123-4567',
    hours: 'Mon-Fri: 8AM-10PM, Sat-Sun: 9AM-9PM',
    deliveryAvailable: true,
    estimatedFillTime: 30,
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Walgreens',
    address: '456 Oak Ave, Anytown, ST 12345',
    phone: '(555) 234-5678',
    hours: 'Mon-Fri: 7AM-11PM, Sat-Sun: 8AM-10PM',
    deliveryAvailable: true,
    estimatedFillTime: 25,
    rating: 4.3,
  },
  {
    id: '3',
    name: 'Rite Aid',
    address: '789 Pine St, Anytown, ST 12345',
    phone: '(555) 345-6789',
    hours: 'Mon-Fri: 8AM-9PM, Sat-Sun: 9AM-8PM',
    deliveryAvailable: false,
    estimatedFillTime: 45,
    rating: 4.1,
  },
] as const;

export const STATUS_COLORS = {
  pending: 'text-orange-400',
  filled: 'text-yellow-400',
  ready: 'text-blue-400',
  delivered: 'text-green-400',
  cancelled: 'text-red-400',
  scheduled: 'text-blue-400',
  confirmed: 'text-green-400',
  completed: 'text-green-400',
  'no-show': 'text-red-400',
} as const;
