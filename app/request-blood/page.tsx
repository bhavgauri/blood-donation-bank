'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RequestStatusBadge, UrgencyBadge } from '@/components/Badges';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { api } from '@/lib/api';
import { BLOOD_GROUPS, formatDate } from '@/lib/utils';
import type { BloodRequest } from '@/lib/types';
import { Loader2, Plus, Phone } from 'lucide-react';
import { toast } from 'sonner';

function RequestBloodContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patientName: '',
    bloodGroup: '',
    requiredUnits: '1',
    hospital: '',
    city: '',
    contactNumber: '',
    urgency: 'medium',
    requiredDate: '',
    notes: '',
  });

  useEffect(() => {
    api.getRequests().then((data) => {
      setRequests(data);
      setListLoading(false);
    }).catch(() => setListLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        requiredUnits: parseInt(form.requiredUnits),
      };
      await api.createRequest(data);
      toast.success('Blood request submitted successfully');
      setShowForm(false);
      const updated = await api.getRequests();
      setRequests(updated);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Blood Requests</h1>
            <p className="mt-1 text-slate-600">Submit and track your blood requests</p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700" onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'Cancel' : 'New Request'}
          </Button>
        </div>

        {showForm && (
          <Card className="mt-6 border-slate-200">
            <CardHeader>
              <CardTitle>New Blood Request</CardTitle>
              <CardDescription>Fill in the patient and blood requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input id="patientName" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group *</Label>
                    <Select value={form.bloodGroup} onValueChange={(v) => setForm({ ...form, bloodGroup: v })}>
                      <SelectTrigger id="bloodGroup"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requiredUnits">Required Units *</Label>
                    <Input id="requiredUnits" type="number" min="1" value={form.requiredUnits} onChange={(e) => setForm({ ...form, requiredUnits: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospital">Hospital *</Label>
                    <Input id="hospital" value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input id="contactNumber" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency *</Label>
                    <Select value={form.urgency} onValueChange={(v) => setForm({ ...form, urgency: v })}>
                      <SelectTrigger id="urgency"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requiredDate">Required Date *</Label>
                    <Input id="requiredDate" type="date" value={form.requiredDate} onChange={(e) => setForm({ ...form, requiredDate: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any additional information" />
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6 border-slate-200">
          <CardHeader>
            <CardTitle>My Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {listLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
              </div>
            ) : requests.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <Phone className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                No blood requests yet. Click "New Request" to create one.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Required Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell className="font-medium">{r.patientName}</TableCell>
                      <TableCell className="font-semibold">{r.bloodGroup}</TableCell>
                      <TableCell>{r.requiredUnits}</TableCell>
                      <TableCell className="text-sm">{r.hospital}</TableCell>
                      <TableCell><UrgencyBadge urgency={r.urgency} /></TableCell>
                      <TableCell>{formatDate(r.requiredDate)}</TableCell>
                      <TableCell><RequestStatusBadge status={r.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RequestBloodPage() {
  return (
    <ProtectedRoute>
      <RequestBloodContent />
    </ProtectedRoute>
  );
}
