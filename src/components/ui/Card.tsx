import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn';

const VARIANT_CLASSES = {
  default: 'bg-white border border-[var(--color-border)] hover:shadow-md',
  glass: 'bg-white/80 backdrop-blur border border-[var(--color-border)] hover:shadow-md',
  elevated: 'bg-white border border-[var(--color-border)] shadow-lg hover:shadow-xl',
} as const;

interface CardProps extends ComponentPropsWithoutRef<'div'> {
  variant?: keyof typeof VARIANT_CLASSES;
}

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[var(--radius-lg)] overflow-hidden transition-shadow duration-200',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  ),
);
CardRoot.displayName = 'Card';

const CardBody = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  ),
);
CardBody.displayName = 'Card.Body';

const CardHeader = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 pt-6 pb-0', className)} {...props} />
  ),
);
CardHeader.displayName = 'Card.Header';

const CardFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 pb-6 pt-0 border-t border-[var(--color-border)]', className)} {...props} />
  ),
);
CardFooter.displayName = 'Card.Footer';

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
