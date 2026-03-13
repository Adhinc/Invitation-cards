import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn';

const VARIANT_CLASSES = {
  default: 'bg-white border border-gray-100',
  glass: 'bg-white/80 backdrop-blur border border-[var(--color-border)]',
  elevated: 'bg-white border border-gray-100 shadow-lg',
} as const;

interface CardProps extends ComponentPropsWithoutRef<'div'> {
  variant?: keyof typeof VARIANT_CLASSES;
}

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-2xl overflow-hidden transition-shadow duration-200', VARIANT_CLASSES[variant], className)}
      {...props}
    />
  ),
);
CardRoot.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-5 pt-5 pb-0', className)} {...props} />
  ),
);
CardHeader.displayName = 'Card.Header';

const CardBody = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-5 py-4', className)} {...props} />
  ),
);
CardBody.displayName = 'Card.Body';

const CardFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-5 pb-5 pt-0 border-t border-gray-100', className)} {...props} />
  ),
);
CardFooter.displayName = 'Card.Footer';

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
