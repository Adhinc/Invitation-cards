import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Camera, MapPin } from 'lucide-react';
import ImageCropper from './ImageCropper';
import MapPicker from './MapPicker';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import type { EventType } from '../constants/events';

const STEPS = {
  EVENT_TYPE: 0,
  PERSON1_NAME: 1,
  PERSON1_IMAGE: 2,
  PERSON2_NAME: 3,
  PERSON2_IMAGE: 4,
  VIEW_PRIORITY: 5,
  PARENTS_QUESTION: 6,
  PARENTS_FLOW_START: 7,
  PARENTS_GROOM_MOTHER: 8,
  PARENTS_BRIDE_FATHER: 9,
  PARENTS_BRIDE_MOTHER: 10,
  DATE: 11,
  TIME: 12,
  ADDRESS: 13,
} as const;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

interface ChatbotProps {
  eventType?: EventType;
  onComplete?: (data: any) => void;
}

const COUPLE_EVENTS: EventType[] = ['wedding', 'betrothal'];

const EVENT_CONFIG: Record<EventType, { label: string; person1: string; person2?: string; }> = {
  wedding: { label: 'Wedding', person1: 'Groom', person2: 'Bride' },
  betrothal: { label: 'Betrothal', person1: 'Groom', person2: 'Bride' },
  birthday: { label: 'Birthday', person1: 'Birthday Person' },
  baptism: { label: 'Baptism', person1: 'Child' },
  holy_communion: { label: 'Holy Communion', person1: 'Child' },
  naming_ceremony: { label: 'Naming Ceremony', person1: 'Baby' },
  baby_shower: { label: 'Baby Shower', person1: 'Mother-to-be' },
  housewarming: { label: 'Housewarming', person1: 'Host' },
};

const Chatbot: React.FC<ChatbotProps> = ({ eventType: eventTypeProp, onComplete }) => {
  const [step, setStep] = useState(() => eventTypeProp ? 1 : 0);
  const [formData, setFormData] = useState<any>(() => eventTypeProp ? { eventType: eventTypeProp } : {});
  const [messages, setMessages] = useState<Message[]>(() => {
    if (eventTypeProp) {
      const cfg = EVENT_CONFIG[eventTypeProp];
      return [
        { role: 'assistant', content: `I'll help you create a beautiful ${cfg.label} Website. Let's start with the ${cfg.person1}'s name, please.` },
      ];
    }
    return [
      { role: 'assistant', content: "Hello! You've reached BigDate. I'll help you create a beautiful Website for your special day." },
      { role: 'assistant', content: "What's your Event ?" },
    ];
  });
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [cropAspect, setCropAspect] = useState(1);
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

  const [parentsPhase, setParentsPhase] = useState<'groom_father' | 'groom_mother' | 'bride_father' | 'bride_mother' | null>(null);

  const isCoupleEvent = () => COUPLE_EVENTS.includes(formData.eventType as EventType);
  const getConfig = () => EVENT_CONFIG[formData.eventType as EventType] || EVENT_CONFIG.wedding;

  const processNextStep = (userInput: string) => {
    let nextStep = step + 1;
    let newFormData = { ...formData };

    switch (step) {
      case STEPS.EVENT_TYPE: { // Event Type
        const eventMap: Record<string, EventType> = {
          'Wedding': 'wedding', 'Betrothal': 'betrothal', 'Birthday': 'birthday',
          'Baptism': 'baptism', 'Holy Communion': 'holy_communion',
          'Naming Ceremony': 'naming_ceremony', 'Baby Shower': 'baby_shower',
          'Housewarming': 'housewarming',
        };
        const matched = Object.entries(eventMap).find(([key]) => userInput.includes(key));
        newFormData.eventType = matched ? matched[1] : 'wedding';
        const cfg = EVENT_CONFIG[newFormData.eventType as EventType];
        addAssistantMessage(`${cfg.person1}'s name, please.`);
        break;
      }
      case STEPS.PERSON1_NAME: // Person 1 Name
        newFormData.person1Name = userInput;
        setCropAspect(1);
        addAssistantMessage(`Please share a profile photo of the ${getConfig().person1}!`);
        break;
      case STEPS.PERSON1_IMAGE: // Person 1 Image
        newFormData.person1Image = userInput.includes("later") ? null : "uploaded";
        if (isCoupleEvent()) {
          addAssistantMessage(`${getConfig().person2}'s name, please.`);
        } else {
          // Skip person 2 — go to parents question
          addAssistantMessage("Would you like to add the parents' names to the invitation ?");
          setFormData(newFormData);
          setStep(STEPS.PARENTS_QUESTION); // Jump to parents step
          return;
        }
        break;
      case STEPS.PERSON2_NAME: // Person 2 Name (couple events only)
        newFormData.person2Name = userInput;
        setCropAspect(1);
        addAssistantMessage(`Please share a profile photo of the ${getConfig().person2}!`);
        break;
      case STEPS.PERSON2_IMAGE: // Person 2 Image
        newFormData.person2Image = userInput.includes("later") ? null : "uploaded";
        addAssistantMessage("Who should be viewed first ?");
        break;
      case STEPS.VIEW_PRIORITY: // View Priority (couple events only)
        newFormData.priority = userInput.includes(getConfig().person2 || '') ? "person2" : "person1";
        addAssistantMessage("Would you like to add the parents' names to the invitation ?");
        break;
      case STEPS.PARENTS_QUESTION: // Parents' Names
        if (userInput.includes("skip") || userInput.includes("Skip")) {
          newFormData.parents = null;
          addAssistantMessage("What's the Date of the event ?");
          setFormData(newFormData);
          setStep(STEPS.DATE);
          return;
        } else {
          newFormData.parents = {};
          if (isCoupleEvent()) {
            setParentsPhase('groom_father');
            addAssistantMessage(`${getConfig().person1}'s Father's name ?`);
          } else {
            setParentsPhase('groom_father');
            addAssistantMessage("Father's name ?");
          }
          setFormData(newFormData);
          setStep(nextStep);
          return;
        }
      case STEPS.PARENTS_FLOW_START: // Parents sub-flow
        if (parentsPhase === 'groom_father') {
          newFormData.parents = { ...newFormData.parents, person1Father: userInput.includes("skip") ? null : userInput };
          setParentsPhase('groom_mother');
          addAssistantMessage(isCoupleEvent() ? `${getConfig().person1}'s Mother's name ?` : "Mother's name ?");
          setFormData(newFormData);
          setStep(nextStep);
          return;
        }
        break;
      case STEPS.PARENTS_GROOM_MOTHER:
        if (parentsPhase === 'groom_mother') {
          newFormData.parents = { ...newFormData.parents, person1Mother: userInput.includes("skip") ? null : userInput };
          if (isCoupleEvent()) {
            setParentsPhase('bride_father');
            addAssistantMessage(`${getConfig().person2}'s Father's name ?`);
            setFormData(newFormData);
            setStep(nextStep);
            return;
          } else {
            setParentsPhase(null);
            addAssistantMessage("What's the Date of the event ?");
            setFormData(newFormData);
            setStep(STEPS.DATE);
            return;
          }
        }
        break;
      case STEPS.PARENTS_BRIDE_FATHER:
        if (parentsPhase === 'bride_father') {
          newFormData.parents = { ...newFormData.parents, person2Father: userInput.includes("skip") ? null : userInput };
          setParentsPhase('bride_mother');
          addAssistantMessage(`${getConfig().person2}'s Mother's name ?`);
          setFormData(newFormData);
          setStep(nextStep);
          return;
        }
        break;
      case STEPS.PARENTS_BRIDE_MOTHER:
        if (parentsPhase === 'bride_mother') {
          newFormData.parents = { ...newFormData.parents, person2Mother: userInput.includes("skip") ? null : userInput };
          setParentsPhase(null);
          addAssistantMessage("What's the Date of the event ?");
          break;
        }
        break;
      case STEPS.DATE: // Date
        newFormData.date = userInput;
        addAssistantMessage("Your event is happening soon! What Time does it start ?");
        break;
      case STEPS.TIME: // Time
        newFormData.time = userInput;
        addAssistantMessage("Share the Address for easy access.");
        break;
      case STEPS.ADDRESS: // Address
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
      className="bg-white border border-gray-200 p-3 md:p-4 rounded-2xl flex flex-col items-center gap-2 min-w-0 shadow-sm hover:border-gray-400 hover:bg-gray-50 group transition-all"
    >
      {icon ? (
        <img src={icon} alt={label} className="w-12 h-12 object-contain" />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">
           <Sparkles size={24} />
        </div>
      )}
      <span className="font-bold text-sm text-[#333] group-hover:text-gray-900">{label}</span>
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

  const handleMapConfirm = (location: string, address: string, coords?: { lat: number; lng: number }) => {
    setShowMapPicker(false);
    setFormData((prev: any) => ({ ...prev, location, address, coords }));
    setMessages(prev => [...prev, { role: 'user', content: `Venue: ${location}` }]);
    setIsProcessing(true);
    setTimeout(() => {
      processNextStep("location_confirmed");
      setIsProcessing(false);
    }, 1200);
  };

  const getStepOptions = () => {
    switch (step) {
      case STEPS.EVENT_TYPE:
        return (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ChoiceChip label="Wedding" onClick={() => handleSend("Its a Wedding")} />
            <ChoiceChip label="Betrothal" onClick={() => handleSend("Its a Betrothal")} />
            <ChoiceChip label="Birthday" onClick={() => handleSend("Its a Birthday")} />
            <ChoiceChip label="Baptism" onClick={() => handleSend("Its a Baptism")} />
            <ChoiceChip label="Holy Communion" onClick={() => handleSend("Its a Holy Communion")} />
            <ChoiceChip label="Naming Ceremony" onClick={() => handleSend("Its a Naming Ceremony")} />
            <ChoiceChip label="Baby Shower" onClick={() => handleSend("Its a Baby Shower")} />
            <ChoiceChip label="Housewarming" onClick={() => handleSend("Its a Housewarming")} />
          </div>
        );
      case STEPS.PERSON1_IMAGE:
      case STEPS.PERSON2_IMAGE:
        return (
           <div className="mt-4 flex gap-3">
             <button onClick={() => handleSend("Add later")} className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-bold hover:border-gray-400 hover:bg-gray-50">Add it later</button>
             <button onClick={triggerUpload} className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-bold flex items-center gap-2">
               <Camera size={14} /> Upload Image
             </button>
           </div>
        );
      case STEPS.VIEW_PRIORITY: {
        const cfg = getConfig();
        return (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ChoiceChip label={cfg.person2 || 'Person 2'} onClick={() => handleSend(`View ${cfg.person2} first`)} />
            <ChoiceChip label={cfg.person1} onClick={() => handleSend(`View ${cfg.person1} first`)} />
          </div>
        );
      }
      case STEPS.PARENTS_QUESTION:
        return (
          <div className="mt-4 flex gap-3">
            <button onClick={() => handleSend("Yes, add parents")} className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-bold">Yes, add them</button>
            <button onClick={() => handleSend("Skip parents")} className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-bold hover:border-gray-400 hover:bg-gray-50">Skip</button>
          </div>
        );
      case STEPS.PARENTS_FLOW_START:
      case STEPS.PARENTS_GROOM_MOTHER:
      case STEPS.PARENTS_BRIDE_FATHER:
      case STEPS.PARENTS_BRIDE_MOTHER:
        if (parentsPhase) {
          return (
            <div className="mt-4">
              <button onClick={() => handleSend("skip")} className="px-5 py-2 bg-white border border-gray-200 text-gray-400 rounded-full text-xs font-bold hover:border-gray-400 hover:text-gray-900 transition-colors">Skip this</button>
            </div>
          );
        }
        return null;
      case STEPS.DATE:
        return (
          <DatePicker onSelect={(dateStr) => handleSend(dateStr)} />
        );
      case STEPS.TIME:
        return (
          <TimePicker onSelect={(timeStr) => handleSend(timeStr)} />
        );
      case STEPS.ADDRESS:
        return (
           <div className="mt-4 flex gap-3">
             <button onClick={() => setShowMapPicker(true)} className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-gray-200">
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
            aspect={cropAspect}
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 w-full h-full bg-white z-50 flex flex-col overflow-hidden"
      >
            {/* Header */}
            <div className="p-5 border-b border-gray-200 flex justify-center items-center bg-gray-900">
              <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-widest">
                <Sparkles size={16} /> BigDate AI
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-hide bg-gradient-to-b from-white to-gray-50">
              <div className="space-y-8 pb-10" aria-live="polite">
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
                            ? 'bg-gray-900 text-white rounded-tr-none font-bold'
                            : 'bg-gray-50 border border-gray-200 text-slate-800 rounded-tl-none font-bold'
                        }`}>
                          {m.role === 'assistant' && (
                            <div className="flex items-center gap-2 mb-2 text-gray-400 text-[9px] uppercase tracking-widest font-black">
                               <Sparkles size={10} className="fill-current" /> AI Assistant
                            </div>
                          )}
                          
                          {m.role === 'assistant' ? (
                            m.content.split(' ').map((word, idx) => {
                              const cleanWord = word.replace(/[?,.!]/g, '');
                              const highlights = ['Website', 'Event', 'Groom', 'Bride', 'Image', 'Date', 'Time', 'Address', 'Wedding', 'Birthday', 'Baptism', 'Baby', 'Father', 'Mother', 'Host', 'Child'];
                              const isHighlight = highlights.includes(cleanWord);
                              return (
                                <span key={idx} className={isHighlight ? 'text-gray-900 font-black underline decoration-gray-300 underline-offset-4' : ''}>
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
                          className="h-2 w-2 bg-gray-400 rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 md:p-6 bg-white border-t border-slate-50 flex items-center gap-3 md:gap-4">
              <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 md:px-6 py-3 md:py-4 flex items-center focus-within:bg-white focus-within:border-gray-400 transition-all">
                <label htmlFor="chat-input" className="sr-only">Type your message</label>
                <input
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none outline-none text-base text-slate-700 placeholder:text-slate-400 font-medium"
                />
              </div>
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isProcessing}
                className="w-12 h-12 md:w-14 md:h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200 hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none shrink-0"
              >
                <Send size={20} />
              </button>
            </div>
      </motion.div>
    </>
  );
};

export default Chatbot;
