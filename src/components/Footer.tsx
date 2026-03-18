import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { EVENTS } from '../constants/events';

export default function Footer() {
  return (
    <footer>
      {/* Let's Get In Touch CTA Section */}
      <div className="bg-gradient-to-b from-[#FFFBF8] to-[#FFF0F4] py-20 text-center">
        <h2 className="text-4xl md:text-[56px] font-bold text-[#2D2A26] leading-tight" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
          Let's Get In Touch
        </h2>
        <p className="mt-4 text-[#4A4744] text-base max-w-md mx-auto">
          Ready to create something beautiful? We'd love to help you celebrate.
        </p>
        <Link
          to="/events/wedding"
          className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-[#B8405E] text-white font-bold text-[15px] rounded-full shadow-[0_6px_28px_rgba(184,64,94,0.4)] hover:shadow-[0_8px_32px_rgba(184,64,94,0.5)] hover:bg-[#A03650] transition-all"
        >
          Create Your Invitation
        </Link>
      </div>

      {/* Footer Links */}
      <div className="bg-[#2D2A26] text-[#A8A4A0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-[#B8405E] rounded-md flex items-center justify-center">
                  <span className="text-white text-xs font-bold">I</span>
                </div>
                <span className="text-base font-bold text-white" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Invitation.AI</span>
              </Link>
              <p className="text-sm leading-relaxed mb-4 max-w-[240px]">
                Create beautiful digital invitation websites for every celebration. Trusted by 10,000+ families.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-lg bg-[#3D3A36] flex items-center justify-center hover:bg-[#B8405E] transition-colors" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-[#3D3A36] flex items-center justify-center hover:bg-[#B8405E] transition-colors" aria-label="WhatsApp">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-[#3D3A36] flex items-center justify-center hover:bg-[#B8405E] transition-colors" aria-label="Email">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Events</h4>
              <ul className="space-y-2.5">
                {EVENTS.slice(0, 5).map(ev => (
                  <li key={ev.slug}>
                    <Link to={ev.urlPath} className="text-sm hover:text-[#D4687C] transition-colors">{ev.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">More</h4>
              <ul className="space-y-2.5">
                {EVENTS.slice(5).map(ev => (
                  <li key={ev.slug}>
                    <Link to={ev.urlPath} className="text-sm hover:text-[#D4687C] transition-colors">{ev.label}</Link>
                  </li>
                ))}
                <li>
                  <Link to="/pricing" className="text-sm hover:text-[#D4687C] transition-colors">Pricing</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2.5">
                {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Contact Us'].map(label => (
                  <li key={label}>
                    <span className="text-sm cursor-not-allowed">{label}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[#6D6A66] mt-6 leading-relaxed">
                INVITATION.AI SOFTWARES<br />
                Kerala, India
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#3D3A36] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#6D6A66]">
              &copy; {new Date().getFullYear()} Invitation.AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <span className="text-xs text-[#6D6A66] cursor-not-allowed">Privacy</span>
              <span className="text-xs text-[#6D6A66] cursor-not-allowed">Terms</span>
              <span className="text-xs text-[#6D6A66] cursor-not-allowed">Refund</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
