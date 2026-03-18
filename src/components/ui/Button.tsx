import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

const VARIANT_CLASSES = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  outline: 'bg-transparent border border-[var(--color-border)] text-gray-700 hover:border-gray-400 hover:text-gray-900',
  accent: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]',
} as const;

const SIZE_CLASSES = {
  sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
  md: 'h-10 px-5 text-sm rounded-lg gap-2',
  lg: 'h-12 px-6 text-sm rounded-lg gap-2',
  xl: 'h-14 px-8 text-base rounded-lg gap-2.5',
} as const;

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: keyof typeof VARIANT_CLASSES;
  size?: keyof typeof SIZE_CLASSES;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : leftIcon}
      {children}
      {rightIcon}
    </button>
  ),
);
Button.displayName = 'Button';
