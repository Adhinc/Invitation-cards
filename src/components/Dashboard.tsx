import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, Eye, TrendingUp, DollarSign,
  Settings, Layout,
  LogOut, Plus, ChevronRight, Star, ExternalLink, Sparkles, MessageCircle, AlertTriangle, Info, CheckCircle
} from 'lucide-react';

type EventFilter = 'All' | 'Wedding' | 'Birthday' | 'Baptism' | 'Baby Shower' | 'Housewarming' | 'Naming Ceremony';

interface Invitation {
  id: number;
  names: string;
  eventType: EventFilter;
  views: string;
  status: 'ACTIVE' | 'EXPIRED';
  image: string;
}

const SAMPLE_INVITATIONS: Invitation[] = [
  { id: 1, names: 'Abishna & Arjun', eventType: 'Wedding', views: '1,204', status: 'ACTIVE', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=200' },
  { id: 2, names: 'Meera & Rahul', eventType: 'Wedding', views: '856', status: 'ACTIVE', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=200' },
  { id: 3, names: 'Little Arya', eventType: 'Birthday', views: '432', status: 'ACTIVE', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=200' },
  { id: 4, names: 'Baby Samuel', eventType: 'Baptism', views: '218', status: 'ACTIVE', image: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?auto=format&fit=crop&q=80&w=200' },
  { id: 5, names: 'Priya & Family', eventType: 'Baby Shower', views: '345', status: 'ACTIVE', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=200' },
  { id: 6, names: 'The Nair Family', eventType: 'Housewarming', views: '167', status: 'ACTIVE', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=200' },
];

const EVENT_FILTERS: EventFilter[] = ['All', 'Wedding', 'Birthday', 'Baptism', 'Baby Shower', 'Housewarming', 'Naming Ceremony'];

const Dashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<EventFilter>('All');
  const [subscription, setSubscription] = useState<{
    plan: string; // '1month', '3months', '1year'
    expiresAt: number;
    active: boolean;
  } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('subscription');
    if (!raw) return;
    const sub = JSON.parse(raw);
    sub.active = sub.expiresAt > Date.now();
    setSubscription(sub);
  }, []);

  const filteredInvitations = activeFilter === 'All'
    ? SAMPLE_INVITATIONS
    : SAMPLE_INVITATIONS.filter(inv => inv.eventType === activeFilter);

  const stats = [
    { label: 'Total Views', value: '12,847', icon: <Eye />, trend: '+12%', color: 'rose' },
    { label: 'Active Invites', value: String(SAMPLE_INVITATIONS.length), icon: <Layout />, trend: '+5', color: 'slate' },
    { label: 'RSVPs Today', value: '142', icon: <Users />, trend: '+28%', color: 'emerald' },
    { label: 'Revenue', value: '₹42,900', icon: <DollarSign />, trend: '+15%', color: 'amber' }
  ];

  const formatExpiryDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-slate-800 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 bg-white h-screen border-r border-rose-100 p-8 flex-col shadow-sm">
        <div className="serif text-3xl font-black text-[var(--color-primary)] italic mb-12 flex items-center gap-2">
           <Sparkles size={24} /> BigDate
        </div>

        <nav aria-label="Dashboard navigation" className="flex-1 space-y-3">
          {['Overview', 'My Invitations', 'Analytics', 'Billing'].map((item) => (
            <button
              key={item}
              aria-current={item === 'Overview' ? 'page' : undefined}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${
                item === 'Overview'
                ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-rose-100'
                : 'text-slate-400 hover:text-[var(--color-primary)] hover:bg-rose-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="opacity-80">
                  {item === 'Overview' && <TrendingUp size={20} />}
                  {item === 'My Invitations' && <Layout size={20} />}
                  {item === 'Analytics' && <Users size={20} />}
                  {item === 'Billing' && <DollarSign size={20} />}
                </span>
                <span className="text-sm font-black uppercase tracking-widest">{item}</span>
              </div>
              {item === 'My Invitations' && <span className="text-[10px] font-black bg-rose-50 text-[var(--color-primary)] px-2 py-0.5 rounded-full">{SAMPLE_INVITATIONS.length}</span>}
            </button>
          ))}

          {/* Event Type Filters */}
          <div className="pt-6 mt-4 border-t border-slate-50">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 mb-3 px-2">Filter by Event</p>
            <div className="space-y-1">
              {EVENT_FILTERS.map((filter) => {
                const count = filter === 'All' ? SAMPLE_INVITATIONS.length : SAMPLE_INVITATIONS.filter(i => i.eventType === filter).length;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      activeFilter === filter
                        ? 'bg-rose-50 text-[var(--color-primary)]'
                        : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>{filter}</span>
                    {count > 0 && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                        activeFilter === filter ? 'bg-[var(--color-primary)] text-white' : 'bg-slate-100 text-slate-400'
                      }`}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Upgrade Banner in Sidebar */}
        <div className="mt-8 p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[32px] text-white relative overflow-hidden group">
           <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
           <Star className="text-amber-400 mb-4 fill-amber-400" size={24} />
           <h4 className="text-sm font-black uppercase tracking-widest mb-2">Upgrade to Business</h4>
           <p className="text-[10px] text-slate-400 font-bold leading-relaxed mb-6">Unlock agency mode, custom branding & analytics.</p>
           <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-colors">
              Upgrade Now
           </button>
        </div>

        <button className="flex items-center gap-3 p-6 text-slate-300 hover:text-rose-500 transition-colors font-black uppercase tracking-widest text-[10px] mt-8 border-t border-slate-50">
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-rose-100">
        <div className="serif text-xl font-black text-[var(--color-primary)] italic flex items-center gap-2">
          <Sparkles size={18} /> BigDate
        </div>
        <div className="flex items-center gap-2">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as EventFilter)}
            className="text-xs font-bold border border-rose-100 rounded-lg px-2 py-1.5 bg-white text-slate-600"
          >
            {EVENT_FILTERS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto bg-[#FFF9F5]">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2 italic">Welcome back,</p>
            <h1 className="text-2xl md:text-4xl serif font-black text-slate-800 italic">Akhil Kottikkal</h1>
          </div>
          <Link to="/" className="btn-premium flex items-center gap-2 md:gap-3 px-5 md:px-8 py-3 md:py-4 shadow-xl shadow-rose-100 text-sm md:text-base shrink-0">
            <Plus size={18} className="stroke-[3]" /> Create New Invite
          </Link>
        </header>

        {/* Subscription Banners */}
        {subscription?.active && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 md:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={18} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-xs md:text-sm font-bold text-emerald-800">Subscription active — expires {formatExpiryDate(subscription.expiresAt)}</p>
                <p className="text-[11px] text-emerald-500 mt-0.5">Enjoy all premium features with your current plan</p>
              </div>
            </div>
            <Link to="/pricing" className="px-4 md:px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-600 transition-colors shadow-sm shrink-0">
              Renew Early
            </Link>
          </motion.div>
        )}

        {subscription && !subscription.active && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 md:p-5 bg-red-50 border border-red-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="text-red-500 shrink-0" />
              <div>
                <p className="text-xs md:text-sm font-bold text-red-800">Subscription expired</p>
                <p className="text-[11px] text-red-400 mt-0.5">Renew your plan to keep your invitation links live</p>
              </div>
            </div>
            <Link to="/pricing" className="px-4 md:px-6 py-2.5 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-600 transition-colors shadow-sm shrink-0">
              Renew
            </Link>
          </motion.div>
        )}

        {!subscription && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 md:p-5 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <Info size={18} className="text-blue-500 shrink-0" />
              <div>
                <p className="text-xs md:text-sm font-bold text-blue-800">You're on the free plan. Upgrade to remove ads and get a shareable link</p>
                <p className="text-[11px] text-blue-400 mt-0.5">Choose from 1-month, 3-month, or 1-year plans</p>
              </div>
            </div>
            <Link to="/pricing" className="px-4 md:px-6 py-2.5 bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-600 transition-colors shadow-sm shrink-0">
              Upgrade
            </Link>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[32px] border border-rose-100 shadow-sm group hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-4 md:mb-6">
                <div className={`p-2.5 md:p-4 rounded-xl md:rounded-2xl ${
                  s.color === 'rose' ? 'bg-rose-50 text-rose-500' :
                  s.color === 'emerald' ? 'bg-emerald-50 text-emerald-500' :
                  s.color === 'amber' ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-500'
                }`}>
                  {React.cloneElement(s.icon as any, { size: 24, className: "stroke-[2.5]" })}
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black">
                  {s.trend}
                </div>
              </div>
              <div className="text-xl md:text-3xl font-black text-slate-800 mb-2">{s.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Active Websites Grid */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="serif text-xl md:text-3xl font-black text-slate-800 italic">
              {activeFilter === 'All' ? 'Active Websites' : `${activeFilter} Invites`}
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] flex items-center gap-2 hover:gap-3 transition-all">
               View All <ChevronRight size={14} />
            </button>
          </div>

          {filteredInvitations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredInvitations.map((inv) => (
                <motion.div
                  key={inv.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[40px] border border-rose-100 shadow-sm flex flex-col md:flex-row gap-4 md:gap-6 hover:border-rose-300 transition-all group relative overflow-hidden"
                >
                  <div className="w-full h-40 md:w-32 md:h-44 rounded-2xl md:rounded-[28px] overflow-hidden bg-slate-100 shrink-0 border-4 border-slate-50 shadow-inner">
                    <img src={inv.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  </div>
                  <div className="flex-1 flex flex-col py-2">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-black text-slate-800">{inv.names}</h4>
                          <p className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mt-1 italic">{inv.eventType} Celebration</p>
                        </div>
                        <div className="bg-rose-50 p-2 rounded-full text-[var(--color-primary)]">
                           <ExternalLink size={16} />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 mt-auto">
                        <div className="p-4 bg-slate-50 rounded-2xl">
                           <span className="text-[10px] font-black text-slate-300 uppercase block mb-1">Total Views</span>
                           <span className="text-lg font-black text-slate-700">{inv.views}</span>
                        </div>
                        <div className="p-4 bg-rose-50/50 rounded-2xl">
                           <span className="text-[10px] font-black text-[var(--color-primary)]/50 uppercase block mb-1">Status</span>
                           <span className="text-lg font-black text-[var(--color-primary)]">{inv.status}</span>
                        </div>
                     </div>

                     <div className="mt-6 flex gap-3">
                        <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">Edit</button>
                        <button aria-label={`Settings for ${inv.names}`} className="px-5 py-3 border border-slate-100 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-[var(--color-primary)] transition-all"><Settings size={14} /></button>
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[32px] border border-rose-100">
              <p className="text-slate-300 font-bold text-sm">No {activeFilter.toLowerCase()} invitations yet</p>
              <button className="mt-4 px-6 py-2 bg-[var(--color-primary)] text-white rounded-xl text-xs font-bold">Create One</button>
            </div>
          )}
        </div>
      </main>

      {/* WhatsApp Support Button */}
      <a
        href="https://wa.me/919876543210?text=Hi%2C%20I%20need%20help%20with%20my%20invitation%20website"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 group"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 relative"
        >
          <MessageCircle size={24} className="text-white fill-white" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
        </motion.div>
        <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-slate-800 text-white text-[10px] font-bold px-3 py-2 rounded-xl whitespace-nowrap shadow-lg">
            Chat with Support
            <div className="absolute -bottom-1 right-5 w-2 h-2 bg-slate-800 rotate-45" />
          </div>
        </div>
      </a>
    </div>
  );
};

export default Dashboard;
