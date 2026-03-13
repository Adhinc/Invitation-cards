import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn';

const VARIANT_CLASSES = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  premium: 'bg-[var(--color-primary)] text-white',
} as const;

interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  variant?: keyof typeof VARIANT_CLASSES;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'info', ...props }, ref) => (
    <span
      ref={ref}
      className={cn('inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide', VARIANT_CLASSES[variant], className)}
      {...props}
    />
  ),
);
Badge.displayName = 'Badge';
