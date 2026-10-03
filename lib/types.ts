export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type Gender = 'male' | 'female' | 'other';

export type UserRole = 'user' | 'admin';

export type DonationStatus = 'pending' | 'approved' | 'rejected';

export type RequestStatus = 'pending' | 'approved' | 'fulfilled' | 'rejected';

export type Urgency = 'low' | 'medium' | 'high' | 'critical';

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  token: string;
  donorId?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface Donor {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  bloodGroup: BloodGroup;
  dateOfBirth: string;
  gender: Gender;
  city: string;
  address: string;
  lastDonationDate: string | null;
  donationCount: number;
  createdAt?: string;
}

export interface Donation {
  _id: string;
  donorId: string;
  donorName: string;
  bloodGroup: BloodGroup;
  donationDate: string;
  location: string;
  bloodBank: string;
  units: number;
  notes: string;
  status: DonationStatus;
  createdAt?: string;
}

export interface BloodInventory {
  _id: string;
  bloodGroup: BloodGroup;
  availableUnits: number;
  reservedUnits: number;
  bloodBank: string;
  location: string;
  contact: string;
  updatedAt: string;
}

export interface BloodRequest {
  _id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  requiredUnits: number;
  hospital: string;
  city: string;
  contactNumber: string;
  urgency: Urgency;
  requiredDate: string;
  notes: string;
  status: RequestStatus;
  requestedBy?: string;
  createdAt?: string;
}

export interface BloodCamp {
  _id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  totalSlots: number;
  registeredCount: number;
  description: string;
  availableSlots?: number;
}

export interface CampRegistration {
  _id: string;
  campId: string;
  userId: string;
  userName: string;
  phone: string;
  bloodGroup?: BloodGroup;
}

export interface DashboardStats {
  totalDonors: number;
  totalBloodUnits: number;
  pendingRequests: number;
  totalDonations: number;
  upcomingCamps: BloodCamp[];
  totalUsers: number;
  totalRequests: number;
  inventoryByGroup: { bloodGroup: BloodGroup; availableUnits: number; reservedUnits: number }[];
  donationsByStatus: Record<DonationStatus, number>;
  requestsByStatus: Record<RequestStatus, number>;
}
