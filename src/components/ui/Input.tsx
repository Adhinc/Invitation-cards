import { forwardRef, useId, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  error?: string;
  hideLabel?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hideLabel, id: idProp, ...props }, ref) => {
    const generatedId = useId();
    const id = idProp || generatedId;
    const errorId = `${id}-error`;

    return (
      <div>
        <label
          htmlFor={id}
          className={cn(
            'block text-sm font-medium text-[var(--color-text-primary)] mb-1.5',
            hideLabel && 'sr-only',
          )}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-4 py-2.5 rounded-full border bg-[var(--color-surface)] text-sm outline-none transition-all',
            error
              ? 'border-[var(--color-error)] focus:ring-2 focus:ring-red-200'
              : 'border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]',
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-[var(--color-error)]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
