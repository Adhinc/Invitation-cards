import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { EVENTS } from '../constants/events';

export default function Footer() {
  return (
    <footer>
      {/* Let's Get In Touch CTA Section */}
      <div style={{ background: 'linear-gradient(to bottom, #FFFBF8, #FFF0F4)', padding: '80px 20px' }} className="text-center">
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 className="text-[#1F1A1B]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 56, lineHeight: '67.2px', marginBottom: 16 }}>
            Let's Get In Touch
          </h2>
          <p style={{ color: '#4A4744', fontSize: 16, lineHeight: '25.6px', maxWidth: 420, margin: '0 auto', marginBottom: 32 }}>
            Ready to create something beautiful? We'd love to help you celebrate.
          </p>
          <Link
            to="/events/wedding"
            className="inline-flex items-center gap-2 text-white transition-all hover:shadow-[0_8px_32px_rgba(184,64,94,0.5)] hover:-translate-y-0.5"
            style={{ background: '#B8405E', padding: '14px 32px', borderRadius: 50, fontSize: 15, fontWeight: 700, boxShadow: '0 6px 28px rgba(184,64,94,0.4)' }}
          >
            Create Your Invitation
          </Link>
        </div>
      </div>

      {/* Footer Links */}
      <div className="bg-[#1F1A1B] text-[#A8A4A0]">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 20px' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-[#B8405E] rounded-md flex items-center justify-center">
                  <span className="text-white text-xs font-bold">I</span>
                </div>
                <span className="text-base font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Invitation.AI</span>
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
