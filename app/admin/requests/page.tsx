'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { RequestStatusBadge, UrgencyBadge } from '@/components/Badges';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { BloodRequest, RequestStatus } from '@/lib/types';
import { Loader2, CheckCircle2, XCircle, Droplet } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    api.getAdminRequests().then((data) => {
      setRequests(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await api.updateRequestStatus(id, status);
      toast.success(`Request ${status}`);
      const updated = await api.getAdminRequests();
      setRequests(updated);
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
      <h1 className="text-3xl font-bold text-slate-900">Blood Requests</h1>
      <p className="mt-1 text-slate-600">Review and manage patient blood requests</p>

      <Card className="mt-6 border-slate-200">
        <CardContent className="pt-6">
          {requests.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No blood requests found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Required Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell className="font-medium">{r.patientName}</TableCell>
                    <TableCell className="font-semibold">{r.bloodGroup}</TableCell>
                    <TableCell>{r.requiredUnits}</TableCell>
                    <TableCell className="text-sm">{r.hospital}</TableCell>
                    <TableCell className="text-sm">{r.city}</TableCell>
                    <TableCell className="text-sm">{r.contactNumber}</TableCell>
                    <TableCell><UrgencyBadge urgency={r.urgency} /></TableCell>
                    <TableCell className="text-sm">{formatDate(r.requiredDate)}</TableCell>
                    <TableCell><RequestStatusBadge status={r.status} /></TableCell>
                    <TableCell>
                      {r.status === 'pending' ? (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => handleStatusChange(r._id, 'approved')}
                            disabled={updating === r._id}
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleStatusChange(r._id, 'rejected')}
                            disabled={updating === r._id}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : r.status === 'approved' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => handleStatusChange(r._id, 'fulfilled')}
                          disabled={updating === r._id}
                        >
                          <Droplet className="h-3 w-3 mr-1" />
                          Fulfill
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400">No actions</span>
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
