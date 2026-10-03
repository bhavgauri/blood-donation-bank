'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BloodGroupBadge } from '@/components/Badges';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { BloodInventory } from '@/lib/types';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<BloodInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editValues, setEditValues] = useState<Record<string, { available: string; reserved: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    api.getBloodInventory().then((data) => {
      setInventory(data);
      const vals: Record<string, { available: string; reserved: string }> = {};
      data.forEach((item) => {
        vals[item.bloodGroup] = {
          available: item.availableUnits.toString(),
          reserved: item.reservedUnits.toString(),
        };
      });
      setEditValues(vals);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (group: string) => {
    setSaving(group);
    try {
      const vals = editValues[group];
      await api.updateBloodInventory(group, {
        availableUnits: parseInt(vals.available) || 0,
        reservedUnits: parseInt(vals.reserved) || 0,
      });
      toast.success(`${group} inventory updated`);
      const updated = await api.getBloodInventory();
      setInventory(updated);
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(null);
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
      <h1 className="text-3xl font-bold text-slate-900">Blood Inventory</h1>
      <p className="mt-1 text-slate-600">Manage blood stock for each group</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {inventory.map((item) => (
          <Card key={item._id} className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle><BloodGroupBadge group={item.bloodGroup} className="text-base" /></CardTitle>
                <span className="text-xs text-slate-400">Updated {formatDate(item.updatedAt)}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Available Units</Label>
                <Input
                  type="number"
                  min="0"
                  value={editValues[item.bloodGroup]?.available ?? '0'}
                  onChange={(e) =>
                    setEditValues({
                      ...editValues,
                      [item.bloodGroup]: { ...editValues[item.bloodGroup], available: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Reserved Units</Label>
                <Input
                  type="number"
                  min="0"
                  value={editValues[item.bloodGroup]?.reserved ?? '0'}
                  onChange={(e) =>
                    setEditValues({
                      ...editValues,
                      [item.bloodGroup]: { ...editValues[item.bloodGroup], reserved: e.target.value },
                    })
                  }
                />
              </div>
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                size="sm"
                onClick={() => handleSave(item.bloodGroup)}
                disabled={saving === item.bloodGroup}
              >
                {saving === item.bloodGroup ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Update
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
