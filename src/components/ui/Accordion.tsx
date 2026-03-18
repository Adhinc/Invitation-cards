import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AccordionContextValue {
  openItem: string | null;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion.Item must be used within Accordion');
  return ctx;
}

interface AccordionProps {
  children: ReactNode;
  className?: string;
  defaultOpen?: string;
}

function AccordionRoot({ children, className, defaultOpen }: AccordionProps) {
  const [openItem, setOpenItem] = useState<string | null>(defaultOpen ?? null);
  const toggle = useCallback((id: string) => {
    setOpenItem((prev) => (prev === id ? null : id));
  }, []);

  return (
    <AccordionContext.Provider value={{ openItem, toggle }}>
      <div className={cn('space-y-3', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

function AccordionItem({ id, title, children, className }: AccordionItemProps) {
  const { openItem, toggle } = useAccordionContext();
  const isOpen = openItem === id;

  return (
    <div className={cn('border border-[var(--color-border)] rounded-2xl overflow-hidden', className)}>
      <button
        onClick={() => toggle(id)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-6 py-4 text-left font-medium hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]"
      >
        <span>{title}</span>
        <ChevronDown className={cn('w-5 h-5 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="region"
          >
            <div className="px-6 pb-4 text-[var(--color-text-secondary)] text-sm">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const Accordion = Object.assign(AccordionRoot, { Item: AccordionItem });
