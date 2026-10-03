'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BloodGroupBadge } from '@/components/Badges';
import { api } from '@/lib/api';
import { BLOOD_GROUPS } from '@/lib/utils';
import type { BloodInventory } from '@/lib/types';
import { Search, Droplet, MapPin, Phone, Building2, Loader2 } from 'lucide-react';

export default function FindBloodPage() {
  const [inventory, setInventory] = useState<BloodInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [bloodGroup, setBloodGroup] = useState('all');
  const [city, setCity] = useState('');

  useEffect(() => {
    api.getBloodInventory().then((data) => {
      setInventory(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = inventory.filter((item) => {
    if (bloodGroup !== 'all' && item.bloodGroup !== bloodGroup) return false;
    if (city && !item.location.toLowerCase().includes(city.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="bg-gradient-to-b from-red-50 to-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">Find Blood</h1>
          <p className="mt-2 text-slate-600">Search available blood units across our network</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <Card className="mb-8 border-slate-200">
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Blood Group</Label>
                <Select value={bloodGroup} onValueChange={setBloodGroup}>
                  <SelectTrigger><SelectValue placeholder="All groups" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    {BLOOD_GROUPS.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>City / Location</Label>
                <Input
                  placeholder="Enter city name"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => { setBloodGroup('all'); setCity(''); }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-slate-500">
              <Search className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              No blood units found matching your criteria.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <Card key={item._id} className="border-slate-200 transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      <BloodGroupBadge group={item.bloodGroup} className="text-base" />
                    </CardTitle>
                    <span className={`text-2xl font-bold ${item.availableUnits < 10 ? 'text-red-600' : 'text-slate-900'}`}>
                      {item.availableUnits}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    {item.bloodBank}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {item.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {item.contact}
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-slate-400" />
                    Reserved: {item.reservedUnits} units
                  </div>
                  {item.availableUnits < 10 && (
                    <div className="mt-2 rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                      Low stock - contact blood bank
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
