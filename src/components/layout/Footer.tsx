import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200" id="location">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 lg:gap-12 items-start">
          <div className="md:col-span-4 lg:col-span-3">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-teal-600" />
              <span className="font-semibold text-lg tracking-tight text-slate-900">
                Riad's Dental Care
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-sm">
              Providing premium, compassionate dental care for you and your family. Your healthy smile is our highest priority.
            </p>
          </div>
          <div className="md:col-span-3 lg:col-span-2">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="/#services" className="hover:text-teal-600 transition-colors">Our Services</a></li>
              <li><Link to="/book" className="hover:text-teal-600 transition-colors">Book Online</Link></li>
              <li><Link to="/about" className="hover:text-teal-600 transition-colors">About the Clinic</Link></li>
            </ul>
          </div>
          <div className="md:col-span-5 lg:col-span-3">
            <h3 className="font-semibold text-slate-900 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>contact@riadsdental.example.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Smile Avenue.<br/>City, ST 12345</li>
            </ul>
          </div>
          <div className="hidden md:block md:col-span-12 lg:col-span-4 border border-slate-200 rounded-2xl overflow-hidden bg-slate-100 min-h-[300px] lg:min-h-[250px] relative shadow-sm">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight={0} 
              marginWidth={0} 
              className="absolute inset-0"
              src="https://maps.google.com/maps?q=Dental%20Clinic,%20New%20York&t=&z=14&ie=UTF8&iwloc=&output=embed" 
              title="Location Map"
            ></iframe>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Riad's Dental Care. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/admin/login" className="hover:text-teal-600 transition-colors">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
