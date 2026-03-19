import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, ExternalLink, Share2, Calendar, Users, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../lib/auth';
import { getUserInvitations, getRsvps } from '../lib/invitations';

interface Invitation {
  id: string;
  slug: string | null;
  event_type: string;
  status: string;
  form_data: any;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  rsvps: { count: number }[];
}

interface Rsvp {
  id: string;
  guest_name: string;
  status: string;
  phone: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
      return;
    }
    if (user) {
      getUserInvitations(user.id).then((data) => {
        setInvitations(data ?? []);
        if (data?.length) setSelectedInvitation(data[0]);
        setLoading(false);
      });
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (selectedInvitation?.id) {
      getRsvps(selectedInvitation.id).then((data) => setRsvps(data ?? []));
    }
  }, [selectedInvitation?.id]);

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFBF8' }}>
        <RefreshCw style={{ width: 24, height: 24, color: '#B8405E', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const inv = selectedInvitation;
  const baseUrl = window.location.origin;
  const invitationUrl = inv?.slug ? `${baseUrl}/i/${inv.slug}` : null;
  const attending = rsvps.filter(r => r.status === 'attending').length;
  const declined = rsvps.filter(r => r.status === 'declined').length;
  const isExpired = inv?.expires_at ? new Date(inv.expires_at) < new Date() : false;

  const copyLink = () => {
    if (invitationUrl) {
      navigator.clipboard.writeText(invitationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    if (invitationUrl) {
      const text = encodeURIComponent(`You're invited! View the invitation: ${invitationUrl}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF8', fontFamily: "'Nunito Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: 0 }}>My Dashboard</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>{user?.email}</span>
          <button onClick={signOut} style={{ fontSize: 13, color: '#B8405E', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
        {invitations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#94a3b8' }}>
            <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>No invitations yet</p>
            <button
              onClick={() => navigate('/')}
              style={{ marginTop: 16, padding: '10px 24px', borderRadius: 10, background: '#B8405E', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
              Create Your First Invitation
            </button>
          </div>
        ) : (
          <>
            {/* Invitation Card */}
            {inv && (
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>
                    {inv.form_data.person1Name}
                    {inv.form_data.person2Name ? ` & ${inv.form_data.person2Name}` : ''}'s{' '}
                    {inv.event_type.charAt(0).toUpperCase() + inv.event_type.slice(1)}
                  </h2>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 999,
                    background: inv.status === 'active' && !isExpired ? '#DCFCE7' : '#FEE2E2',
                    color: inv.status === 'active' && !isExpired ? '#166534' : '#991B1B',
                  }}>
                    {isExpired ? 'Expired' : inv.status === 'active' ? 'Active' : 'Draft'}
                  </span>
                </div>

                {invitationUrl && (
                  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>
                    <QRCodeSVG value={invitationUrl} size={120} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6, marginTop: 0 }}>Your invitation link</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
                        <span style={{ fontSize: 13, color: '#1e293b', flex: 1, wordBreak: 'break-all' as const }}>{invitationUrl}</span>
                        <button onClick={copyLink} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}>
                          {copied ? <Check style={{ width: 18, height: 18, color: '#22c55e' }} /> : <Copy style={{ width: 18, height: 18 }} />}
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                        <button onClick={shareWhatsApp} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                          <Share2 style={{ width: 14, height: 14 }} /> WhatsApp
                        </button>
                        <a href={invitationUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                          <ExternalLink style={{ width: 14, height: 14 }} /> View
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {inv.expires_at && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Calendar style={{ width: 14, height: 14, color: '#64748b' }} />
                    <span style={{ fontSize: 13, color: '#64748b' }}>
                      Expires: {new Date(inv.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {isExpired && (
                      <button
                        onClick={() => navigate('/pricing')}
                        style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: '#B8405E', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Renew
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* RSVP Section */}
            {inv && (
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>
                    <Users style={{ width: 18, height: 18, display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                    RSVPs
                  </h3>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>{attending} attending</span>
                    <span style={{ fontSize: 13, color: '#ef4444', fontWeight: 600 }}>{declined} declined</span>
                  </div>
                </div>

                {rsvps.length === 0 ? (
                  <p style={{ fontSize: 14, color: '#94a3b8', textAlign: 'center', padding: '24px 0', margin: 0 }}>No RSVPs yet. Share your invitation link!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                    {rsvps.map((r) => (
                      <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 10, background: '#f8fafc' }}>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', margin: 0 }}>{r.guest_name}</p>
                          {r.phone && <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{r.phone}</p>}
                        </div>
                        <span style={{
                          fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 999,
                          background: r.status === 'attending' ? '#DCFCE7' : '#FEE2E2',
                          color: r.status === 'attending' ? '#166534' : '#991B1B',
                        }}>
                          {r.status === 'attending' ? 'Attending' : 'Declined'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export const Component = DashboardPage;
