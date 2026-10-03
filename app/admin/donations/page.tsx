'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BloodGroupBadge, DonationStatusBadge } from '@/components/Badges';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Donation } from '@/lib/types';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    api.getAdminDonations().then((data) => {
      setDonations(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await api.updateDonationStatus(id, status);
      toast.success(`Donation ${status}`);
      const updated = await api.getAdminDonations();
      setDonations(updated);
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setUpdating(null);
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
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-slate-900">Donations</h1>
      <p className="mt-1 text-slate-600">Review and manage blood donations</p>

      <Card className="mt-6 border-slate-200">
        <CardContent className="pt-6">
          {donations.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No donations recorded yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((d) => (
                  <TableRow key={d._id}>
                    <TableCell className="font-medium">{d.donorName}</TableCell>
                    <TableCell><BloodGroupBadge group={d.bloodGroup} /></TableCell>
                    <TableCell className="text-sm">{formatDate(d.donationDate)}</TableCell>
                    <TableCell className="text-sm">{d.location}</TableCell>
                    <TableCell>{d.units}</TableCell>
                    <TableCell className="text-sm text-slate-500 max-w-xs truncate">{d.notes || '-'}</TableCell>
                    <TableCell><DonationStatusBadge status={d.status} /></TableCell>
                    <TableCell>
                      {d.status === 'pending' ? (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => handleStatusChange(d._id, 'approved')}
                            disabled={updating === d._id}
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleStatusChange(d._id, 'rejected')}
                            disabled={updating === d._id}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
