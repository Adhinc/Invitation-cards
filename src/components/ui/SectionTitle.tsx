import { forwardRef, useId } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';
import { fadeUp } from '../../utils/animations';

interface SectionTitleProps extends HTMLMotionProps<'div'> {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  accentColor?: string;
}

export const SectionTitle = forwardRef<HTMLDivElement, SectionTitleProps>(
  ({ className, title, subtitle, align = 'center', accentColor, ...props }, ref) => {
    const id = useId();
    return (
      <motion.div
        ref={ref}
        variants={fadeUp}
        className={cn('mb-12', align === 'center' && 'text-center', className)}
        {...props}
      >
        <h2 id={id} className="text-2xl sm:text-3xl md:text-4xl font-bold serif">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        <div
          className="mt-4 mx-auto w-16 h-1 rounded-full"
          style={{ background: accentColor || 'var(--color-primary)' }}
        />
      </motion.div>
    );
  },
);
SectionTitle.displayName = 'SectionTitle';
