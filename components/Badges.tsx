import { cn } from '@/lib/utils';
import {
  bloodGroupColors,
  donationStatusColors,
  requestStatusColors,
  urgencyColors,
} from '@/lib/utils';
import type { BloodGroup, DonationStatus, RequestStatus, Urgency } from '@/lib/types';

export function BloodGroupBadge({ group, className }: { group: BloodGroup; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        bloodGroupColors[group] || 'bg-gray-100 text-gray-700 border-gray-200',
        className
      )}
    >
      {group}
    </span>
  );
}

export function DonationStatusBadge({ status }: { status: DonationStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize',
        donationStatusColors[status]
      )}
    >
      {status}
    </span>
  );
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize',
        requestStatusColors[status]
      )}
    >
      {status}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize',
        urgencyColors[urgency]
      )}
    >
      {urgency}
    </span>
  );
}
