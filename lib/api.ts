import type {
  AuthResponse,
  BloodInventory,
  BloodRequest,
  BloodCamp,
  Donor,
  Donation,
  DashboardStats,
  User,
} from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lifelink_token');
}

export function setToken(token: string) {
  localStorage.setItem('lifelink_token', token);
}

export function clearToken() {
  localStorage.removeItem('lifelink_token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data as T;
}

export const api = {
  // Auth
  register: (body: Record<string, unknown>) =>
    request<AuthResponse & { donorId?: string }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request<User & { donor: Donor | null }>('/auth/me'),

  // Donors
  getMyDonorProfile: () => request<{ donor: Donor; donations: Donation[] }>('/donors'),
  updateMyDonorProfile: (body: Record<string, unknown>) =>
    request<Donor>('/donors', { method: 'PUT', body: JSON.stringify(body) }),

  // Blood
  getBloodInventory: (city?: string) =>
    request<BloodInventory[]>(`/blood${city ? `?city=${encodeURIComponent(city)}` : ''}`),
  getBloodByGroup: (group: string) => request<BloodInventory>(`/blood/${group}`),
  updateBloodInventory: (group: string, body: Record<string, unknown>) =>
    request<BloodInventory>(`/blood/${group}`, { method: 'PUT', body: JSON.stringify(body) }),

  // Donations
  createDonation: (body: Record<string, unknown>) =>
    request<Donation>('/donations', { method: 'POST', body: JSON.stringify(body) }),
  getDonations: () => request<Donation[]>('/donations'),
  updateDonationStatus: (id: string, status: string) =>
    request<Donation>(`/donations/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Requests
  createRequest: (body: Record<string, unknown>) =>
    request<BloodRequest>('/requests', { method: 'POST', body: JSON.stringify(body) }),
  getRequests: () => request<BloodRequest[]>('/requests'),
  updateRequestStatus: (id: string, status: string) =>
    request<BloodRequest>(`/requests/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Camps
  getCamps: () => request<BloodCamp[]>('/camps'),
  createCamp: (body: Record<string, unknown>) =>
    request<BloodCamp>('/camps', { method: 'POST', body: JSON.stringify(body) }),
  updateCamp: (id: string, body: Record<string, unknown>) =>
    request<BloodCamp>(`/camps/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCamp: (id: string) =>
    request<{ message: string }>(`/camps/${id}`, { method: 'DELETE' }),
  registerForCamp: (id: string) =>
    request<{ message: string; registration: unknown }>(`/camps/${id}/register`, { method: 'POST' }),

  // Admin
  getDashboard: () => request<DashboardStats>('/admin/dashboard'),
  getUsers: () => request<User[]>('/admin/users'),
  getAdminDonors: () => request<(Donor & { userId?: { email: string; role: string } })[]>('/admin/donors'),
  getAdminRequests: () => request<BloodRequest[]>('/admin/requests'),
  getAdminDonations: () => request<Donation[]>('/admin/donations'),
  getAdminCamps: () => request<BloodCamp[]>('/admin/camps'),
  getCampRegistrations: (campId: string) =>
    request<unknown[]>(`/admin/camps/${campId}/registrations`),
  updateAdminDonor: (id: string, body: Record<string, unknown>) =>
    request<Donor>(`/admin/donors/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
};
