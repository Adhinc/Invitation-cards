import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

const VARIANT_CLASSES = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-[0_6px_28px_rgba(184,64,94,0.4)] hover:shadow-[0_8px_32px_rgba(184,64,94,0.5)]',
  secondary: 'bg-[#FFF5EE] text-[#B8405E] hover:bg-[#FFE8DC]',
  ghost: 'bg-transparent text-[#4A4744] hover:bg-[#FFF5EE] hover:text-[#2D2A26]',
  outline: 'bg-transparent border border-[var(--color-border)] text-[#4A4744] hover:border-[#B8405E] hover:text-[#B8405E]',
  accent: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-[0_6px_28px_rgba(184,64,94,0.4)]',
} as const;

const SIZE_CLASSES = {
  sm: 'h-8 px-3 text-xs rounded-full gap-1.5',
  md: 'h-10 px-5 text-sm rounded-full gap-2',
  lg: 'h-12 px-6 text-sm rounded-full gap-2',
  xl: 'h-14 px-8 text-[15px] rounded-full gap-2.5',
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
        'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8405E] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
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
