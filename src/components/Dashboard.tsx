import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Eye, TrendingUp, DollarSign, 
  Settings, Layout, 
  LogOut, Plus, ChevronRight, Star, ExternalLink, Sparkles
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Views', value: '12,847', icon: <Eye />, trend: '+12%', color: 'rose' },
    { label: 'Active Invites', value: '84', icon: <Layout />, trend: '+5', color: 'slate' },
    { label: 'RSVPs Today', value: '142', icon: <Users />, trend: '+28%', color: 'emerald' },
    { label: 'Revenue', value: '₹42,900', icon: <DollarSign />, trend: '+15%', color: 'amber' }
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-slate-800 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white h-screen border-r border-rose-100 p-8 flex flex-col shadow-sm">
        <div className="serif text-3xl font-black text-[#C85C6C] italic mb-12 flex items-center gap-2">
           <Sparkles size={24} /> Initation
        </div>
        
        <nav className="flex-1 space-y-3">
          {['Overview', 'My Invitations', 'Analytics', 'Agency settings', 'Billing'].map((item) => (
            <button 
              key={item} 
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${
                item === 'Overview' 
                ? 'bg-[#C85C6C] text-white shadow-lg shadow-rose-100' 
                : 'text-slate-400 hover:text-[#C85C6C] hover:bg-rose-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="opacity-80">
                  {item === 'Overview' && <TrendingUp size={20} />}
                  {item === 'My Invitations' && <Layout size={20} />}
                  {item === 'Analytics' && <Users size={20} />}
                  {item === 'Agency settings' && <Settings size={20} />}
                  {item === 'Billing' && <DollarSign size={20} />}
                </span>
                <span className="text-sm font-black uppercase tracking-widest">{item}</span>
              </div>
              {item === 'My Invitations' && <span className="text-[10px] font-black bg-rose-50 text-[#C85C6C] px-2 py-0.5 rounded-full">12</span>}
            </button>
          ))}
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

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto bg-[#FFF9F5]">
        <header className="flex justify-between items-center mb-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2 italic">Welcome back,</p>
            <h1 className="text-4xl serif font-black text-slate-800 italic">Akhil Kottikkal</h1>
          </div>
          <button className="btn-premium flex items-center gap-3 px-8 py-4 shadow-xl shadow-rose-100">
            <Plus size={20} className="stroke-[3]" /> Create New Invite
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {stats.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[32px] border border-rose-100 shadow-sm group hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${
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
              <div className="text-3xl font-black text-slate-800 mb-2">{s.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Active Websites Grid */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="serif text-3xl font-black text-slate-800 italic">Active Websites</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-[#C85C6C] flex items-center gap-2 hover:gap-3 transition-all">
               View All <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((item) => (
              <div key={item} className="bg-white p-6 rounded-[40px] border border-rose-100 shadow-sm flex gap-6 hover:border-rose-300 transition-all group relative overflow-hidden">
                <div className="w-32 h-44 rounded-[28px] overflow-hidden bg-slate-100 shrink-0 border-4 border-slate-50 shadow-inner">
                  <img src={`https://images.unsplash.com/photo-${1519741497673 + item}?auto=format&fit=crop&q=80&w=200`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                </div>
                <div className="flex-1 flex flex-col py-2">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-black text-slate-800">{item === 1 ? 'Abishna & Arjun' : 'Meera & Rahul'}</h4>
                        <p className="text-[10px] font-black text-[#C85C6C] uppercase tracking-widest mt-1 italic">Wedding Celebration</p>
                      </div>
                      <div className="bg-rose-50 p-2 rounded-full text-[#C85C6C]">
                         <ExternalLink size={16} />
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 mt-auto">
                      <div className="p-4 bg-slate-50 rounded-2xl">
                         <span className="text-[10px] font-black text-slate-300 uppercase block mb-1">Total Views</span>
                         <span className="text-lg font-black text-slate-700">{item === 1 ? '1,204' : '856'}</span>
                      </div>
                      <div className="p-4 bg-rose-50/50 rounded-2xl">
                         <span className="text-[10px] font-black text-[#C85C6C]/50 uppercase block mb-1">Status</span>
                         <span className="text-lg font-black text-[#C85C6C]">ACTIVE</span>
                      </div>
                   </div>
                   
                   <div className="mt-6 flex gap-3">
                      <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">Edit</button>
                      <button className="px-5 py-3 border border-slate-100 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-[#C85C6C] transition-all"><Settings size={14} /></button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
