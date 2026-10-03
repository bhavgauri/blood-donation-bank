import { Heart, Shield, Activity, Award, Users, Droplet } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-[calc(100vh-4rem)]">
      <div className="bg-gradient-to-b from-red-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-slate-900">About LifeLink</h1>
          <p className="mt-4 text-lg text-slate-600">
            LifeLink is a blood bank and donation management platform dedicated to
            connecting donors with patients in need. We believe every blood donation
            has the power to save a life.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: Shield, title: 'Our Mission', desc: 'To ensure no patient goes without blood when they need it most. We connect donors, blood banks, and hospitals through a single platform.' },
            { icon: Heart, title: 'Our Vision', desc: 'A world where blood is always available for those in need, powered by a community of dedicated donors and efficient technology.' },
            { icon: Activity, title: 'Our Impact', desc: 'Since launch, LifeLink has facilitated thousands of donations, organized hundreds of camps, and helped save countless lives.' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                <item.icon className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-slate-900 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Our Values</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, title: 'Community', desc: 'Built by donors, for donors' },
              { icon: Shield, title: 'Safety', desc: 'Secure and verified process' },
              { icon: Droplet, title: 'Accessibility', desc: 'Blood for everyone, everywhere' },
              { icon: Award, title: 'Excellence', desc: 'Committed to quality care' },
            ].map((v, i) => (
              <div key={i}>
                <v.icon className="mx-auto mb-2 h-8 w-8 text-red-500" />
                <div className="font-semibold text-white">{v.title}</div>
                <div className="text-sm text-slate-400">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
