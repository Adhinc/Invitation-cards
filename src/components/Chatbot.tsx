import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Camera, MapPin } from 'lucide-react';
import ImageCropper from './ImageCropper';
import MapPicker from './MapPicker';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

interface ChatbotProps {
  onComplete?: (data: any) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! You've reached BigDate. I'll help you create a beautiful Website for your big day." },
    { role: 'assistant', content: "What's your Event ?" }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const BOT_AVATAR = "https://cdn-icons-png.flaticon.com/512/4712/4712109.png";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addAssistantMessage = (content: string) => {
    setMessages(prev => [...prev, { role: 'assistant', content }]);
  };

  const handleSend = (text?: string) => {
    const finalInput = text || input;
    if (!finalInput.trim() || isProcessing) return;
    
    setMessages(prev => [...prev, { role: 'user', content: finalInput }]);
    setInput('');
    setIsProcessing(true);
    
    setTimeout(() => {
      processNextStep(finalInput);
      setIsProcessing(false);
    }, 1200);
  };

  const processNextStep = (userInput: string) => {
    let nextStep = step + 1;
    let newFormData = { ...formData };

    switch (step) {
      case 0: // Event Type
        newFormData.eventType = userInput.includes("Wedding") ? "wedding" : "betrothal";
        addAssistantMessage("Groom's name, please.");
        break;
      case 1: // Groom Name
        newFormData.groomName = userInput;
        addAssistantMessage(`Please share an Image of the Groom (square)!`);
        break;
      case 2: // Groom Image
        newFormData.groomImage = userInput.includes("later") ? null : "uploaded";
        addAssistantMessage("Bride's name, please.");
        break;
      case 3: // Bride Name
        newFormData.brideName = userInput;
        addAssistantMessage("Please share an Image of the Bride (square)!");
        break;
      case 4: // Bride Image
        newFormData.brideImage = userInput.includes("later") ? null : "uploaded";
        addAssistantMessage("Who should be viewed first ?");
        break;
      case 5: // View Priority
        newFormData.priority = userInput.includes("Bride") ? "bride" : "groom";
        addAssistantMessage("What's the Date of the event ?");
        break;
      case 6: // Date
        newFormData.date = userInput;
        addAssistantMessage("Your event is happening soon! What Time does it start ?");
        break;
      case 7: // Time
        newFormData.time = userInput;
        addAssistantMessage("Share the Address for easy access.");
        break;
      case 8: // Address
        newFormData.address = userInput;
        addAssistantMessage("Magic is happening... Unwrapping Your Invite Magic!");
        if (onComplete) {
          setTimeout(() => onComplete(newFormData), 2000);
        }
        break;
    }

    setFormData(newFormData);
    setStep(nextStep);
  };

  const ChoiceChip = ({ label, icon, onClick }: { label: string, icon?: string, onClick: () => void }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-white border border-[#EBBAB9]/30 p-4 rounded-2xl flex flex-col items-center gap-2 min-w-[120px] shadow-sm hover:border-[#C85C6C] group transition-all"
    >
      {icon ? (
        <img src={icon} alt={label} className="w-12 h-12 object-contain" />
      ) : (
        <div className="w-12 h-12 rounded-full bg-[#EBBAB9]/20 flex items-center justify-center text-[#C85C6C]">
           <Sparkles size={24} />
        </div>
      )}
      <span className="font-bold text-sm text-[#333] group-hover:text-[#C85C6C]">{label}</span>
    </motion.button>
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPendingImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setShowCropper(false);
    setMessages(prev => [...prev, { role: 'user', content: "Uploaded an image", image: croppedImage }]);
    setIsProcessing(true);
    setTimeout(() => {
      processNextStep("image_uploaded");
      setIsProcessing(false);
    }, 1200);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleMapConfirm = (location: string, address: string) => {
    setShowMapPicker(false);
    setFormData((prev: any) => ({ ...prev, location, address }));
    setMessages(prev => [...prev, { role: 'user', content: `Venue: ${location}, ${address}` }]);
    setIsProcessing(true);
    setTimeout(() => {
      processNextStep("location_confirmed");
      setIsProcessing(false);
    }, 1200);
  };

  const getStepOptions = () => {
    switch (step) {
      case 0:
        return (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ChoiceChip label="Wedding" icon="https://cdn-icons-png.flaticon.com/512/3656/3656824.png" onClick={() => handleSend("Its a Wedding function")} />
            <ChoiceChip label="Betrothal" icon="https://cdn-icons-png.flaticon.com/512/3656/3656799.png" onClick={() => handleSend("Its a Betrothal ceremony")} />
          </div>
        );
      case 2:
      case 4:
        return (
           <div className="mt-4 flex gap-3">
             <button onClick={() => handleSend("Add later")} className="px-6 py-2 bg-white border border-[#C85C6C] text-[#C85C6C] rounded-full text-sm font-bold">Add it later</button>
             <button onClick={triggerUpload} className="px-6 py-2 bg-[#C85C6C] text-white rounded-full text-sm font-bold flex items-center gap-2">
               <Camera size={14} /> Upload Image
             </button>
           </div>
        );
      case 5:
        return (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ChoiceChip label="Bride" icon="https://cdn-icons-png.flaticon.com/512/4140/4140047.png" onClick={() => handleSend("View Bride first")} />
            <ChoiceChip label="Groom" icon="https://cdn-icons-png.flaticon.com/512/4140/4140048.png" onClick={() => handleSend("View Groom first")} />
          </div>
        );
      case 7:
        return (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {["Morning", "Afternoon", "Evening"].map(t => (
               <button key={t} onClick={() => handleSend(t)} className="px-4 py-2 border border-[#EBBAB9] rounded-full text-xs font-bold hover:bg-[#C85C6C] hover:text-white transition-colors">{t}</button>
            ))}
          </div>
        );
      case 8:
        return (
           <div className="mt-4 flex gap-3">
             <button onClick={() => setShowMapPicker(true)} className="px-6 py-2 bg-[#C85C6C] text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-rose-100">
               <MapPin size={14} /> Select on Map
             </button>
           </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      <AnimatePresence>
        {showCropper && pendingImage && (
          <ImageCropper 
            image={pendingImage} 
            onCropComplete={handleCropComplete} 
            onCancel={() => setShowCropper(false)} 
          />
        )}
        {showMapPicker && (
          <MapPicker 
            onConfirm={handleMapConfirm} 
            onCancel={() => setShowMapPicker(false)} 
          />
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#C85C6C] text-white rounded-full shadow-2xl z-50 flex items-center justify-center border-4 border-white"
      >
        <Sparkles size={28} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-24 right-8 w-[420px] h-[700px] bg-white rounded-[32px] z-50 flex flex-col overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.15)] border border-[#EBBAB9]/20"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#EBBAB9]/10 flex justify-between items-center bg-white">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[10px] uppercase tracking-widest font-black px-4 py-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"
              >
                Exit Chat
              </button>
              <div className="px-5 py-2 border-2 border-[#C85C6C] text-[#C85C6C] rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#C85C6C] hover:text-white cursor-pointer transition-all">
                View Templates
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-rose-500 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-hide bg-gradient-to-b from-white to-[#FFF9F5]">
              <div className="space-y-8 pb-10">
                <AnimatePresence initial={false}>
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", damping: 25, stiffness: 120 }}
                      className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {m.role === 'assistant' && (
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center p-2 flex-shrink-0">
                          <img src={BOT_AVATAR} className="w-full h-full object-contain" alt="Bot" />
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-5 rounded-[28px] text-[15px] leading-relaxed shadow-sm transition-all duration-300 ${
                          m.role === 'user' 
                            ? 'bg-[#C85C6C] text-white rounded-tr-none font-bold' 
                            : 'bg-white border border-rose-100 text-slate-800 rounded-tl-none font-bold'
                        }`}>
                          {m.role === 'assistant' && (
                            <div className="flex items-center gap-2 mb-2 text-[#C85C6C]/40 text-[9px] uppercase tracking-widest font-black">
                               <Sparkles size={10} className="fill-current" /> AI Assistant
                            </div>
                          )}
                          
                          {m.role === 'assistant' ? (
                            m.content.split(' ').map((word, idx) => {
                              const cleanWord = word.replace(/[?,.!]/g, '');
                              const highlights = ['Website', 'Event', 'Groom', 'Bride', 'Image', 'Date', 'Time', 'Address', 'Wedding'];
                              const isHighlight = highlights.includes(cleanWord);
                              return (
                                <span key={idx} className={isHighlight ? 'text-[#C85C6C] font-black underline decoration-rose-100 underline-offset-4' : ''}>
                                  {word}{' '}
                                </span>
                              );
                            })
                          ) : (
                            m.content
                          )}
                          
                          {m.image && (
                            <div className="mt-4 rounded-2xl overflow-hidden shadow-md border-4 border-white">
                              <img src={m.image} alt="Upload" className="w-full h-auto" />
                            </div>
                          )}
                        </div>

                        {/* Options rendered as part of the flow */}
                        {m.role === 'assistant' && i === messages.length - 1 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            {getStepOptions()}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center p-2">
                       <img src={BOT_AVATAR} className="w-full h-full object-contain opacity-50" alt="Bot" />
                    </div>
                    <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-slate-50 flex gap-1.5 shadow-sm">
                      {[0, 0.2, 0.4].map(delay => (
                        <motion.span 
                          key={delay}
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }} 
                          transition={{ repeat: Infinity, duration: 1, delay }} 
                          className="h-2 w-2 bg-[#C85C6C]/40 rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-50 flex items-center gap-4">
              <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex items-center focus-within:bg-white focus-within:border-rose-200 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none outline-none text-base text-slate-700 placeholder:text-slate-400 font-medium"
                />
              </div>
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isProcessing}
                className="w-14 h-14 bg-[#C85C6C] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 hover:bg-[#b04b5a] active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                <Send size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
