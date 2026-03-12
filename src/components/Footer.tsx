import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { EVENTS } from '../constants/events';

const eventLinksCol1 = EVENTS.slice(0, 5);
const eventLinksCol2 = EVENTS.slice(5);

const companyLinks = [
  { label: 'Pricing', to: '/pricing' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Refund Policy', to: '/refund' },
  { label: 'Contact Us', to: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-1.5">
              <Sparkles className="h-5 w-5 text-[#C85C6C]" />
              <span className="text-xl font-serif italic font-semibold text-white">
                BigDate
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Create beautiful, personalized event websites for weddings, birthdays,
              baptisms, and more. Share your special moments with the people who matter most.
            </p>
          </div>

          {/* Events Column 1 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Events
            </h3>
            <ul className="space-y-2.5">
              {eventLinksCol1.map(event => (
                <li key={event.slug}>
                  <Link
                    to={event.urlPath}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {event.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Events Column 2 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">
              More Events
            </h3>
            <ul className="space-y-2.5">
              {eventLinksCol2.map(event => (
                <li key={event.slug}>
                  <Link
                    to={event.urlPath}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {event.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} BigDate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
