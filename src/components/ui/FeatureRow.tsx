import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../utils/animations';
import { cn } from '../../utils/cn';

interface FeatureRowProps {
  kicker: string;
  title: string;
  description: string;
  visual: ReactNode;
  children?: ReactNode;
  reverse?: boolean;
  className?: string;
}

export function FeatureRow({ kicker, title, description, visual, children, reverse, className }: FeatureRowProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-12 items-center', className)}>
      <motion.div variants={fadeUp} className={cn(reverse && 'md:order-2')}>
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-3">
          {kicker}
        </p>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 serif leading-snug">
          {title}
        </h2>
        <p className="text-base text-[var(--color-text-secondary)] mb-6 leading-relaxed">
          {description}
        </p>
        {children}
      </motion.div>
      <motion.div variants={fadeUp} className={cn(reverse && 'md:order-1', 'flex justify-center')}>
        {visual}
      </motion.div>
    </div>
  );
}
