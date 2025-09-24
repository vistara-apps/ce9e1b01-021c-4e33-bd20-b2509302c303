import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
  return phoneRegex.test(phone);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export function getStatusColor(status: string): string {
  const colors = {
    pending: 'text-orange-400',
    filled: 'text-yellow-400',
    ready: 'text-blue-400',
    delivered: 'text-green-400',
    cancelled: 'text-red-400',
    scheduled: 'text-blue-400',
    confirmed: 'text-green-400',
    completed: 'text-green-400',
    'no-show': 'text-red-400',
  };
  
  return colors[status as keyof typeof colors] || 'text-gray-400';
}

export function estimateDeliveryTime(pharmacyFillTime: number, deliveryOption: 'pickup' | 'delivery'): string {
  const now = new Date();
  const estimatedMinutes = pharmacyFillTime + (deliveryOption === 'delivery' ? 60 : 0);
  const estimatedTime = new Date(now.getTime() + estimatedMinutes * 60000);
  
  return estimatedTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function searchItems<T>(items: T[], searchTerm: string, searchFields: (keyof T)[]): T[] {
  if (!searchTerm.trim()) return items;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  
  return items.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      return typeof value === 'string' && value.toLowerCase().includes(lowercaseSearch);
    })
  );
}
