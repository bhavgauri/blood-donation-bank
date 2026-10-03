'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BloodGroupBadge, DonationStatusBadge } from '@/components/Badges';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { api } from '@/lib/api';
import { BLOOD_GROUPS, formatDate } from '@/lib/utils';
import type { Donor, Donation } from '@/lib/types';
import { User as UserIcon, Droplet, Calendar, Loader2, Save, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

function ProfileContent() {
  const { user, donor, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    bloodGroup: '',
    dateOfBirth: '',
    gender: '',
    city: '',
    address: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getMyDonorProfile().then((data: any) => {
      const d: Donor = data.donor;
      setForm({
        name: d.name,
        phone: d.phone,
        bloodGroup: d.bloodGroup,
        dateOfBirth: d.dateOfBirth.split('T')[0],
        gender: d.gender,
        city: d.city,
        address: d.address || '',
      });
      setDonations(data.donations || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateMyDonorProfile(form);
      await refreshUser();
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="mt-1 text-slate-600">Manage your donor information and view donation history</p>

        <div className="mt-8">
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile Info</TabsTrigger>
              <TabsTrigger value="donations">Donation History ({donations.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card className="border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Donor Information</CardTitle>
                    <CardDescription>Your personal and medical details</CardDescription>
                  </div>
                  {!editing ? (
                    <Button variant="outline" onClick={() => setEditing(true)}>Edit</Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                      <Button className="bg-red-600 hover:bg-red-700" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      {editing ? (
                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      ) : (
                        <div className="flex items-center gap-2 rounded-md border p-2 text-sm">
                          <UserIcon className="h-4 w-4 text-slate-400" />
                          {donor?.name}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      {editing ? (
                        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                      ) : (
                        <div className="flex items-center gap-2 rounded-md border p-2 text-sm">
                          <Phone className="h-4 w-4 text-slate-400" />
                          {donor?.phone}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Blood Group</Label>
                      {editing ? (
                        <Select value={form.bloodGroup} onValueChange={(v) => setForm({ ...form, bloodGroup: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {BLOOD_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2"><BloodGroupBadge group={donor?.bloodGroup as any} /></div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      {editing ? (
                        <Input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
                      ) : (
                        <div className="flex items-center gap-2 rounded-md border p-2 text-sm">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {formatDate(donor?.dateOfBirth)}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      {editing ? (
                        <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="rounded-md border p-2 text-sm capitalize">{donor?.gender}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      {editing ? (
                        <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                      ) : (
                        <div className="rounded-md border p-2 text-sm">{donor?.city}</div>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Address</Label>
                      {editing ? (
                        <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                      ) : (
                        <div className="rounded-md border p-2 text-sm">{donor?.address || 'N/A'}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="flex items-center gap-2 rounded-md border bg-slate-50 p-2 text-sm text-slate-500">
                        <Mail className="h-4 w-4" />
                        {user?.email}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Last Donation</Label>
                      <div className="rounded-md border p-2 text-sm">{formatDate(donor?.lastDonationDate)}</div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">{donor?.donationCount || 0}</div>
                      <div className="text-sm text-slate-500">Total Donations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900">{formatDate(donor?.lastDonationDate)}</div>
                      <div className="text-sm text-slate-500">Last Donation</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="donations" className="mt-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Donation History</CardTitle>
                  <CardDescription>Your past blood donations</CardDescription>
                </CardHeader>
                <CardContent>
                  {donations.length === 0 ? (
                    <div className="py-12 text-center text-slate-500">
                      <Droplet className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                      No donations yet. <a href="/donate" className="text-red-600 hover:underline">Donate blood</a> to get started.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Blood Group</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Units</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {donations.map((d) => (
                          <TableRow key={d._id}>
                            <TableCell>{formatDate(d.donationDate)}</TableCell>
                            <TableCell><BloodGroupBadge group={d.bloodGroup} /></TableCell>
                            <TableCell className="text-sm">{d.location}</TableCell>
                            <TableCell>{d.units}</TableCell>
                            <TableCell><DonationStatusBadge status={d.status} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
