import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { BloodGroup, DonationStatus, RequestStatus, Urgency } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const bloodGroupColors: Record<string, string> = {
  'A+': 'bg-red-100 text-red-700 border-red-200',
  'A-': 'bg-red-50 text-red-600 border-red-100',
  'B+': 'bg-blue-100 text-blue-700 border-blue-200',
  'B-': 'bg-blue-50 text-blue-600 border-blue-100',
  'AB+': 'bg-teal-100 text-teal-700 border-teal-200',
  'AB-': 'bg-teal-50 text-teal-600 border-teal-100',
  'O+': 'bg-green-100 text-green-700 border-green-200',
  'O-': 'bg-green-50 text-green-600 border-green-100',
};

export const donationStatusColors: Record<DonationStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

export const requestStatusColors: Record<RequestStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-blue-100 text-blue-700 border-blue-200',
  fulfilled: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

export const urgencyColors: Record<Urgency, string> = {
  low: 'bg-gray-100 text-gray-700 border-gray-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateLong(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
