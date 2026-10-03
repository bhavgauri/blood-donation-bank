'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/context/AuthContext';
import { formatDateLong } from '@/lib/utils';
import type { BloodCamp } from '@/lib/types';
import { Calendar, Clock, MapPin, Users, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CampsPage() {
  const [camps, setCamps] = useState<BloodCamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    api.getCamps().then((data) => {
      setCamps(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleRegister = async (campId: string) => {
    if (!user) {
      toast.info('Please login to register');
      router.push('/login');
      return;
    }
    setRegistering(campId);
    try {
      await api.registerForCamp(campId);
      toast.success('Successfully registered for camp!');
      setRegisteredIds((prev) => new Set(prev).add(campId));
      setCamps((prev) =>
        prev.map((c) =>
          c._id === campId ? { ...c, registeredCount: c.registeredCount + 1 } : c
        )
      );
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setRegistering(null);
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
      <div className="bg-gradient-to-b from-red-50 to-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">Blood Donation Camps</h1>
          <p className="mt-2 text-slate-600">Find and register for a camp near you</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {camps.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-slate-500">
              <Calendar className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              No blood camps scheduled. Check back soon!
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {camps.map((camp) => {
              const available = (camp.availableSlots ?? camp.totalSlots - camp.registeredCount);
              const isFull = available <= 0;
              const isRegistered = registeredIds.has(camp._id);
              return (
                <Card key={camp._id} className="border-slate-200 transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-red-600">
                      <Calendar className="h-4 w-4" />
                      {formatDateLong(camp.date)}
                    </div>
                    <CardTitle className="text-lg">{camp.name}</CardTitle>
                    {camp.description && (
                      <p className="text-sm text-slate-500">{camp.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm text-slate-600">
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
                    </div>
                    <div className="flex items-center justify-between border-t pt-3">
                      <Badge variant={isFull ? 'destructive' : 'secondary'}>
                        {isFull ? 'Full' : `${available} slots left`}
                      </Badge>
                      {isRegistered ? (
                        <Button disabled variant="outline" size="sm">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                          Registered
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          disabled={isFull || registering === camp._id}
                          onClick={() => handleRegister(camp._id)}
                        >
                          {registering === camp._id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Register
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
