import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { EVENTS } from '../constants/events';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-1.5 mb-3">
              <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
              <span className="text-base font-serif italic font-semibold">BigDate</span>
            </Link>
            <p className="text-[12px] text-gray-500 leading-relaxed max-w-[200px]">
              Create beautiful digital invitation websites for every celebration.
            </p>
          </div>

          {/* Events */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Events</h4>
            <ul className="space-y-1.5">
              {EVENTS.slice(0, 5).map(ev => (
                <li key={ev.slug}>
                  <Link to={ev.urlPath} className="text-[12px] text-gray-500 hover:text-white transition-colors">
                    {ev.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Events */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">More</h4>
            <ul className="space-y-1.5">
              {EVENTS.slice(5).map(ev => (
                <li key={ev.slug}>
                  <Link to={ev.urlPath} className="text-[12px] text-gray-500 hover:text-white transition-colors">
                    {ev.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/pricing" className="text-[12px] text-gray-500 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Company</h4>
            <ul className="space-y-1.5">
              {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Contact Us'].map(label => (
                <li key={label}>
                  <span className="text-[12px] text-gray-500 cursor-not-allowed">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-center">
          <p className="text-[11px] text-gray-600">
            &copy; {new Date().getFullYear()} BigDate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
