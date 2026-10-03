'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BloodGroupBadge } from '@/components/Badges';
import { api } from '@/lib/api';
import { Droplet, Loader2, Calendar, Building2, Info } from 'lucide-react';
import { toast } from 'sonner';

function DonateContent() {
  const { donor } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    donationDate: new Date().toISOString().split('T')[0],
    location: 'LifeLink Central Blood Bank',
    bloodBank: 'LifeLink Central Blood Bank',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createDonation(form);
      toast.success('Donation recorded! It will be reviewed by our team.');
      router.push('/profile');
    } catch (err: any) {
      toast.error(err.message || 'Failed to record donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">Donate Blood</h1>
        <p className="mt-1 text-slate-600">Record your blood donation details</p>

        {donor && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
                <Droplet className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Welcome, {donor.name}</div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  Blood Group: <BloodGroupBadge group={donor.bloodGroup} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6 border-slate-200">
          <CardHeader>
            <CardTitle>Donation Details</CardTitle>
            <CardDescription>Fill in the details of your blood donation</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="donationDate">Donation Date *</Label>
                <Input
                  id="donationDate"
                  type="date"
                  value={form.donationDate}
                  onChange={(e) => setForm({ ...form, donationDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodBank">Blood Bank *</Label>
                <Input
                  id="bloodBank"
                  value={form.bloodBank}
                  onChange={(e) => setForm({ ...form, bloodBank: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional information about your donation"
                />
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <p>Your donation will be reviewed by our team. Once approved, your blood group inventory will be updated and your donation count will increase.</p>
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Droplet className="mr-2 h-4 w-4" />}
                Submit Donation
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <ProtectedRoute>
      <DonateContent />
    </ProtectedRoute>
  );
}
