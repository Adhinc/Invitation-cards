import { forwardRef, useId } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';
import { fadeUp } from '../../utils/animations';

interface SectionTitleProps extends HTMLMotionProps<'div'> {
  title: string;
  subtitle?: string;
  kicker?: string;
  align?: 'left' | 'center';
}

export const SectionTitle = forwardRef<HTMLDivElement, SectionTitleProps>(
  ({ className, title, subtitle, kicker, align = 'center', ...props }, ref) => {
    const id = useId();
    return (
      <motion.div
        ref={ref}
        variants={fadeUp}
        className={cn('mb-12', align === 'center' && 'text-center', className)}
        {...props}
      >
        {kicker && (
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-3">
            {kicker}
          </p>
        )}
        <h2 id={id} className="text-2xl md:text-3xl font-bold serif">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-[var(--color-text-secondary)] text-base max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </motion.div>
    );
  },
);
SectionTitle.displayName = 'SectionTitle';
