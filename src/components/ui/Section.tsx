import { forwardRef, useId } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';
import { stagger } from '../../utils/animations';

interface SectionProps extends HTMLMotionProps<'section'> {
  label?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, label, children, ...props }, ref) => {
    const id = useId();
    return (
      <motion.section
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
        className={cn('max-w-5xl mx-auto px-5 py-16 md:py-24', className)}
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
