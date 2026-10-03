import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600">
                <Heart className="h-5 w-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold text-white">
                Life<span className="text-red-500">Link</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-400">
              Connecting donors with those in need. Every donation saves lives.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/find-blood" className="hover:text-red-400">Find Blood</Link></li>
              <li><Link href="/camps" className="hover:text-red-400">Blood Camps</Link></li>
              <li><Link href="/register" className="hover:text-red-400">Become a Donor</Link></li>
              <li><Link href="/about" className="hover:text-red-400">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1-800-LIFELINK</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@lifelink.com</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Main Facility, Downtown</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Follow Us</h3>
            <div className="mt-4 flex gap-4">
              <Facebook className="h-6 w-6 cursor-pointer hover:text-red-400" />
              <Twitter className="h-6 w-6 cursor-pointer hover:text-red-400" />
              <Instagram className="h-6 w-6 cursor-pointer hover:text-red-400" />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} LifeLink Blood Bank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
