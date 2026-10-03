'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { api } from '@/lib/api';
import { formatDateLong } from '@/lib/utils';
import type { BloodCamp } from '@/lib/types';
import { Loader2, Plus, Pencil, Trash2, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCampsPage() {
  const [camps, setCamps] = useState<BloodCamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BloodCamp | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BloodCamp | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    name: '', date: '', time: '', location: '', organizer: '', totalSlots: '50', description: '',
  });

  useEffect(() => {
    api.getAdminCamps().then((data) => {
      setCamps(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', date: '', time: '', location: '', organizer: '', totalSlots: '50', description: '' });
    setShowForm(true);
  };

  const openEdit = (camp: BloodCamp) => {
    setEditing(camp);
    setForm({
      name: camp.name,
      date: camp.date.split('T')[0],
      time: camp.time,
      location: camp.location,
      organizer: camp.organizer,
      totalSlots: camp.totalSlots.toString(),
      description: camp.description || '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { ...form, totalSlots: parseInt(form.totalSlots) };
      if (editing) {
        await api.updateCamp(editing._id, data);
        toast.success('Camp updated successfully');
      } else {
        await api.createCamp(data);
        toast.success('Camp created successfully');
      }
      setShowForm(false);
      const updated = await api.getAdminCamps();
      setCamps(updated);
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteCamp(deleteTarget._id);
      toast.success('Camp deleted successfully');
      setDeleteTarget(null);
      const updated = await api.getAdminCamps();
      setCamps(updated);
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setDeleting(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Blood Camps</h1>
          <p className="mt-1 text-slate-600">Create and manage blood donation camps</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Camp
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {camps.length === 0 ? (
          <Card className="col-span-full border-dashed">
            <CardContent className="py-12 text-center text-slate-500">
              <Calendar className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              No camps scheduled. Click "New Camp" to create one.
            </CardContent>
          </Card>
        ) : (
          camps.map((camp) => {
            const available = camp.totalSlots - camp.registeredCount;
            return (
              <Card key={camp._id} className="border-slate-200 transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{camp.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(camp)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(camp)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {formatDateLong(camp.date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    {camp.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {camp.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400" />
                    {camp.organizer}
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <Badge variant={available <= 0 ? 'destructive' : 'secondary'}>
                      {available} / {camp.totalSlots} slots
                    </Badge>
                    <span className="text-xs text-slate-400">{camp.registeredCount} registered</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={showForm} onOpenChange={(open) => !open && setShowForm(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Camp' : 'Create Blood Camp'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update camp details' : 'Fill in the details for a new blood donation camp'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Camp Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Time *</Label>
                <Input placeholder="e.g. 09:00 AM - 04:00 PM" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Location *</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Organizer *</Label>
                <Input value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Total Slots *</Label>
              <Input type="number" min="1" value={form.totalSlots} onChange={(e) => setForm({ ...form, totalSlots: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {editing ? 'Update Camp' : 'Create Camp'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Camp</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo;? This will also remove all registrations. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
