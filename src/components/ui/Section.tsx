import { forwardRef, useId } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
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

interface SectionProps extends HTMLMotionProps<'section'> {
  label?: string;
  size?: keyof typeof SIZE_CLASSES;
  spacing?: keyof typeof SPACING_CLASSES;
  muted?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, label, size = 'wide', spacing = 'standard', muted, children, ...props }, ref) => {
    const id = useId();
    return (
      <motion.section
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
        className={cn(
          'mx-auto px-5',
          SIZE_CLASSES[size],
          SPACING_CLASSES[spacing],
          muted && 'bg-[var(--color-surface-muted)]',
          className,
        )}
        aria-labelledby={label ? id : undefined}
        {...props}
      >
        {label && <span id={id} className="sr-only">{label}</span>}
        {children}
      </motion.section>
    );
  },
);
Section.displayName = 'Section';
