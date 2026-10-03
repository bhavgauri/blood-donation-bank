'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BloodGroupBadge } from '@/components/Badges';
import { api } from '@/lib/api';
import { BLOOD_GROUPS, formatDateLong } from '@/lib/utils';
import type { BloodInventory, BloodCamp } from '@/lib/types';
import {
  Heart,
  Droplet,
  Users,
  Search,
  Calendar,
  Award,
  Activity,
  Shield,
  Clock,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export default function Home() {
  const [inventory, setInventory] = useState<BloodInventory[]>([]);
  const [camps, setCamps] = useState<BloodCamp[]>([]);

  useEffect(() => {
    api.getBloodInventory().then(setInventory).catch(() => {});
    api.getCamps().then(setCamps).catch(() => {});
  }, []);

  const totalUnits = inventory.reduce((sum, item) => sum + item.availableUnits, 0);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50 to-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-red-600 blur-3xl" />
          <div className="absolute right-1/4 bottom-10 h-48 w-48 rounded-full bg-red-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-red-700">
              <Heart className="h-4 w-4" fill="currentColor" />
              Every drop counts
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Save Lives Through <span className="text-red-600">Blood Donation</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              LifeLink connects blood donors with patients in need. Join our community
              of heroes who give the gift of life.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-base" asChild>
                <Link href="/register">
                  <Droplet className="mr-2 h-5 w-5" />
                  Donate Blood
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link href="/find-blood">
                  <Search className="mr-2 h-5 w-5" />
                  Find Blood
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="border-b bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { icon: Users, label: 'Active Donors', value: '2,500+' },
              { icon: Droplet, label: 'Blood Units', value: totalUnits > 0 ? totalUnits.toString() : '320+' },
              { icon: Calendar, label: 'Blood Camps', value: camps.length > 0 ? camps.length.toString() : '12' },
              { icon: Heart, label: 'Lives Saved', value: '5,800+' },
            ].map((stat, i) => (
              <Card key={i} className="border-slate-200 text-center transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    <stat.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blood Group Availability */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Blood Group Availability</h2>
            <p className="mt-2 text-slate-600">Current inventory at LifeLink Central Blood Bank</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {BLOOD_GROUPS.map((group) => {
              const item = inventory.find((i) => i.bloodGroup === group);
              const units = item?.availableUnits ?? 0;
              const low = units < 10;
              return (
                <Card key={group} className="border-slate-200 text-center transition-all hover:shadow-md">
                  <CardContent className="pt-6">
                    <BloodGroupBadge group={group} className="text-base" />
                    <div className={`mt-3 text-2xl font-bold ${low ? 'text-red-600' : 'text-slate-900'}`}>
                      {units}
                    </div>
                    <div className="text-xs text-slate-500">units</div>
                    {low && (
                      <div className="mt-2 text-xs font-medium text-red-600">Low stock</div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Camps */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Upcoming Blood Camps</h2>
              <p className="mt-2 text-slate-600">Join a camp near you and make a difference</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/camps">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {(camps.length > 0 ? camps : []).slice(0, 3).map((camp) => (
              <Card key={camp._id} className="border-slate-200 transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2 text-sm text-red-600">
                    <Calendar className="h-4 w-4" />
                    {formatDateLong(camp.date)}
                  </div>
                  <CardTitle className="text-lg">{camp.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
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
                    {(camp.availableSlots ?? camp.totalSlots - camp.registeredCount)} slots available
                  </div>
                </CardContent>
              </Card>
            ))}
            {camps.length === 0 && (
              <Card className="col-span-full border-dashed">
                <CardContent className="py-12 text-center text-slate-500">
                  <Calendar className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                  No upcoming camps. Check back soon!
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white">How It Works</h2>
            <p className="mt-2 text-slate-400">Three simple steps to save a life</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Users, step: '01', title: 'Register', desc: 'Create your donor profile with your blood group and contact details.' },
              { icon: Droplet, step: '02', title: 'Donate', desc: 'Visit a blood bank or camp and record your donation in the system.' },
              { icon: Heart, step: '03', title: 'Save Lives', desc: 'Your blood goes to patients who need it most. Track your impact.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600/20">
                  <item.icon className="h-8 w-8 text-red-500" />
                </div>
                <div className="text-sm font-bold text-red-500">{item.step}</div>
                <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Donor Stories</h2>
            <p className="mt-2 text-slate-600">Hear from our community of heroes</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: 'Sarah Johnson', group: 'O-', text: 'I have donated 15 times through LifeLink. Knowing my blood type is universal makes every donation even more meaningful.' },
              { name: 'Michael Chen', group: 'A+', text: 'The platform made it so easy to find a camp near me and register. The whole process was smooth and professional.' },
              { name: 'Emily Davis', group: 'B-', text: 'After my father needed blood urgently, I became a regular donor. LifeLink makes it simple to give back.' },
            ].map((t, i) => (
              <Card key={i} className="border-slate-200">
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                      <span className="text-sm font-bold text-red-600">{t.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{t.name}</div>
                      <BloodGroupBadge group={t.group as any} />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 italic">&ldquo;{t.text}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-red-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Shield className="mx-auto mb-4 h-12 w-12 text-white" />
          <h2 className="text-3xl font-bold text-white">Ready to Save a Life?</h2>
          <p className="mt-4 text-lg text-red-100">
            Join thousands of donors who are making a difference every day.
          </p>
          <Button size="lg" variant="secondary" className="mt-6 text-base" asChild>
            <Link href="/register">
              Become a Donor <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
