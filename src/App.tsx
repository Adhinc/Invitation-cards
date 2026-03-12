import React, { useState } from 'react';
import CinematicGallery from './components/CinematicGallery';
import CountdownTimer from './components/CountdownTimer';
import VenueMap from './components/VenueMap';
import Chatbot from './components/Chatbot';
import TemplateGallery from './components/TemplateGallery';
import Shagun from './components/Shagun';
import Dashboard from './components/Dashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, Clock, Share2, LayoutDashboard } from 'lucide-react';

type AppView = 'home' | 'selection' | 'chatbot' | 'loading' | 'preview' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [inviteData, setInviteData] = useState<any>({
    stars: ['Abishna', 'Arjun'],
    date: '2026-08-14',
    time: '12:00 PM',
    location: 'The Grand Palace, Kochi',
    address: 'Panampilly Nagar, Kochi, Kerala, India'
  });

  const handleOnboardingComplete = (data: any) => {
    setInviteData((prev: any) => ({ ...prev, ...data }));
    setView('loading');
    
    // Cinematic Loading Duration
    setTimeout(() => {
      setView('preview');
    }, 4000);
  };

  const galleryImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80'
  ];

  const handleShare = () => {
    const text = `You're invited to our big day! 💍 View the invitation here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#2D2D2D] overflow-x-hidden font-sans relative">
      {/* Premium Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-rose-100/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-rose-100/20 blur-[120px] rounded-full" />
        
        {/* Floating Petals / Sparkles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, opacity: 0 }}
            animate={{ 
              y: [0, 800], 
              x: [0, (i % 2 === 0 ? 50 : -50)],
              opacity: [0, 0.4, 0],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 15 + i * 2, 
              repeat: Infinity, 
              delay: i * 3,
              ease: "linear"
            }}
            className="absolute text-[#C85C6C]/10"
            style={{ 
              left: `${15 + i * 15}%`,
              top: '-5%'
            }}
          >
            <Heart size={12 + i * 4} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* View Toggle (Demo Only) */}
      <button 
        onClick={() => setView(view === 'dashboard' ? 'home' : 'dashboard')}
        className="fixed top-4 left-4 z-[60] bg-white p-3 rounded-full shadow-lg border border-rose-100 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#C85C6C] hover:bg-rose-50 transition-colors"
      >
        <LayoutDashboard size={14} /> {view === 'dashboard' ? 'Return to Site' : 'Manager Dashboard'}
      </button>

      <AnimatePresence mode="wait">
        {view === 'loading' && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center text-center p-10"
          >
            <div className="relative w-48 h-48 mb-12">
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                 className="absolute inset-0 border-[1px] border-slate-100 rounded-full"
               />
                <motion.div 
                 animate={{ rotate: -360 }} 
                 transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                 className="absolute inset-4 border-[1px] border-slate-100 rounded-full flex items-center justify-center"
               >
                 <div className="w-2 h-2 bg-slate-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2" />
                 <div className="w-1 h-1 bg-rose-400 rounded-full absolute bottom-4 right-10" />
               </motion.div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#C85C6C] rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-rose-100">
                     14
                  </div>
               </div>
            </div>
            
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Just a Sec...</h2>
            <h3 className="serif text-3xl text-[#C85C6C] italic">Unwrapping Your Invite Magic</h3>
          </motion.div>
        )}

        {view === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <TemplateGallery onFinish={() => setView('chatbot')} />
          </motion.div>
        )}

        {view === 'chatbot' && (
          <motion.div
            key="chatbot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#FFF9F5] z-50 flex items-center justify-center"
          >
             <Chatbot onComplete={handleOnboardingComplete} />
          </motion.div>
        )}

        {view === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dashboard />
          </motion.div>
        ) : (view === 'home' || view === 'preview') && (
          <motion.div
            key="invitation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-lg mx-auto p-4 md:p-8"
          >
            {/* Hero Section */}
            <motion.section 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-rose-50 mb-12"
            >
              <div className="flex justify-center mb-10">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center">
                  <Heart className="text-[#C85C6C]" fill="#C85C6C" size={24} />
                </div>
              </div>
              
              {view === 'home' ? (
                <>
                  <h1 className="text-4xl md:text-5xl mb-6 text-slate-800 font-black tracking-tight leading-tight">
                    Make Your Special Moments <span className="text-[#C85C6C] italic serif">Unforgettable</span>
                  </h1>
                  <p className="text-slate-400 mb-10 max-w-sm mx-auto font-bold">
                    Create a premium invitation website in minutes. No design skills needed.
                  </p>
                  <button 
                    onClick={() => setView('selection')}
                    className="btn-premium px-12 py-5 shadow-2xl shadow-rose-200"
                  >
                    Create Website
                  </button>
                  <div className="mt-12 flex justify-center gap-8 grayscale opacity-40">
                    <div className="flex flex-col items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest">Chat AI</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest">Select Style</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest">Share Fast</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 italic">Together with their families</p>
                  <h2 className="text-xl serif italic text-slate-500 mb-2">request the pleasure of your company</h2>
                  <h1 className="text-5xl md:text-6xl mb-10 text-[#C85C6C] font-black serif">
                    {inviteData.stars.join(' & ')}
                  </h1>
                  
                  <div className="flex justify-center flex-col items-center gap-6">
                    <div className="px-8 py-4 bg-slate-50 rounded-2xl flex items-center gap-6 border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-800 font-bold">
                           <Calendar size={18} className="text-[#C85C6C]" /> 
                           <span>{new Date(inviteData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                       <Clock size={16} /> <span>Promptly at {inviteData.time}</span>
                    </div>
                  </div>
                </>
              )}
            </motion.section>

            {/* Content only visible in preview mode */}
            {view === 'preview' && (
              <>
                {/* Gallery Section */}
                <motion.section 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="mb-12"
                >
                  <CinematicGallery images={galleryImages} />
                </motion.section>

                {/* Countdown Section */}
                <motion.section 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="mb-12 text-center"
                >
                  <h3 className="serif text-4xl text-[#2D2D2D] mb-8 font-black">Countdown to Forever</h3>
                  <CountdownTimer targetDate={`${inviteData.date}T12:00:00`} />
                </motion.section>

                {/* Venue Section */}
                <motion.section 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <h3 className="serif text-4xl mb-8 text-center font-black">The Venue</h3>
                  <VenueMap 
                    locationName={inviteData.location} 
                    address={inviteData.address}
                    mapUrl="https://maps.google.com"
                  />
                </motion.section>

                {/* Shagun Section */}
                <motion.section 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="mb-12"
                >
                  <Shagun upiId="wedding.initation@okaxis" recipientName={inviteData.stars.join(' & ')} />
                </motion.section>

                {/* Checkout Panel in Preview */}
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-rose-100/50 z-40 flex items-center justify-between shadow-2xl md:max-w-lg md:mx-auto md:bottom-6 md:rounded-[32px] md:border">
                   <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Premium Template</p>
                      <h4 className="text-xl font-black text-slate-800">₹699 <span className="text-sm font-bold text-slate-300 line-through ml-2">₹1299</span></h4>
                   </div>
                   <button 
                     onClick={() => setView('dashboard')}
                     className="px-10 py-4 bg-[#C85C6C] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-rose-100"
                   >
                     Finish & Buy
                   </button>
                </div>

                {/* Footer / Share */}
                <footer className="text-center py-32 border-t border-rose-100/50">
                  <p className="serif text-3xl text-[#C85C6C] mb-10 italic">Can't wait to see you there!</p>
                  <div className="flex justify-center gap-4">
                    <button className="btn-premium px-10 py-4 shadow-xl shadow-rose-100">
                       Add to Calendar
                    </button>
                    <button 
                      onClick={handleShare}
                      className="w-14 h-14 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm"
                    >
                      <Share2 size={24} className="text-[#C85C6C]" />
                    </button>
                  </div>
                  <div className="mt-16 text-slate-300 text-[10px] font-black tracking-[0.3em] uppercase">
                    Crafted with Love by Initation Crads
                  </div>
                </footer>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
