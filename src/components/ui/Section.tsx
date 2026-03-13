import { forwardRef, useId, type CSSProperties, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { stagger } from '../../utils/animations';

const SIZE_CLASSES = {
  wide: 'max-w-6xl',
  narrow: 'max-w-3xl',
} as const;

const SPACING_CLASSES = {
  standard: 'py-20 md:py-28',
  compact: 'py-12 md:py-16',
} as const;

interface SectionProps {
  label?: string;
  size?: keyof typeof SIZE_CLASSES;
  spacing?: keyof typeof SPACING_CLASSES;
  muted?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, label, size = 'wide', spacing = 'standard', muted, children, style }, ref) => {
    const id = useId();
    return (
      <section
        ref={ref}
        className={cn(
          SPACING_CLASSES[spacing],
          muted && 'bg-[var(--color-surface-muted)]',
        )}
        style={style}
        aria-labelledby={label ? id : undefined}
      >
        {label && <span id={id} className="sr-only">{label}</span>}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className={cn('mx-auto px-5', SIZE_CLASSES[size], className)}
        >
          {children}
        </motion.div>
      </section>
    );
  },
);
Section.displayName = 'Section';
