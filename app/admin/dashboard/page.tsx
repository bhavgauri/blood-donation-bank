'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BloodGroupBadge } from '@/components/Badges';
import { api } from '@/lib/api';
import { formatDateLong } from '@/lib/utils';
import type { DashboardStats } from '@/lib/types';
import {
  Users, Droplet, Heart, ClipboardList, Calendar, Loader2, Building2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import Link from 'next/link';

const PIE_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard().then((data) => {
      setStats(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  const inventoryData = stats.inventoryByGroup.map((item) => ({
    name: item.bloodGroup,
    available: item.availableUnits,
    reserved: item.reservedUnits,
  }));

  const requestData = [
    { name: 'Pending', value: stats.requestsByStatus.pending },
    { name: 'Approved', value: stats.requestsByStatus.approved },
    { name: 'Fulfilled', value: stats.requestsByStatus.fulfilled },
    { name: 'Rejected', value: stats.requestsByStatus.rejected },
  ];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="mt-1 text-slate-600">Overview of LifeLink blood bank system</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, label: 'Total Donors', value: stats.totalDonors, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Droplet, label: 'Blood Units', value: stats.totalBloodUnits, color: 'text-red-600', bg: 'bg-red-50' },
          { icon: ClipboardList, label: 'Pending Requests', value: stats.pendingRequests, color: 'text-amber-600', bg: 'bg-amber-50' },
          { icon: Heart, label: 'Total Donations', value: stats.totalDonations, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((card, i) => (
          <Card key={i} className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{card.value}</div>
                  <div className="text-sm text-slate-500">{card.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-200">
          <CardContent className="pt-6 text-center">
            <Building2 className="mx-auto mb-2 h-8 w-8 text-slate-400" />
            <div className="text-2xl font-bold text-slate-900">{stats.totalUsers}</div>
            <div className="text-sm text-slate-500">Total Users</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="pt-6 text-center">
            <ClipboardList className="mx-auto mb-2 h-8 w-8 text-slate-400" />
            <div className="text-2xl font-bold text-slate-900">{stats.totalRequests}</div>
            <div className="text-sm text-slate-500">Total Requests</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="pt-6 text-center">
            <Calendar className="mx-auto mb-2 h-8 w-8 text-slate-400" />
            <div className="text-2xl font-bold text-slate-900">{stats.upcomingCamps.length}</div>
            <div className="text-sm text-slate-500">Upcoming Camps</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Blood Inventory by Group</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RTooltip />
                <Bar dataKey="available" fill="#ef4444" radius={[4, 4, 0, 0]} name="Available" />
                <Bar dataKey="reserved" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Reserved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Blood Requests by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={requestData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {requestData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <RTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Blood Camps</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.upcomingCamps.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No upcoming camps.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats.upcomingCamps.map((camp) => (
                <Link
                  key={camp._id}
                  href="/admin/camps"
                  className="rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md"
                >
                  <div className="text-sm font-medium text-red-600">{formatDateLong(camp.date)}</div>
                  <div className="mt-1 font-semibold text-slate-900">{camp.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{camp.location}</div>
                  <div className="mt-2 text-xs text-slate-400">
                    {camp.registeredCount}/{camp.totalSlots} registered
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
