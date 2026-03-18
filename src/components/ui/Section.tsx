import { forwardRef, useId, type CSSProperties, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { stagger } from '../../utils/animations';

const SIZE_CLASSES = {
  wide: 'max-w-7xl',
  narrow: 'max-w-3xl',
} as const;

const SPACING_CLASSES = {
  standard: 'py-20 md:py-28',
  compact: 'py-12 md:py-16',
} as const;

/**
 * Background variants for clear section differentiation:
 * - default: body cream #FFFBF8
 * - white: pure white for contrast against cream
 * - muted: warm peach #FFF5EE
 * - blush: light pink #FFF0F4
 * - warm-gradient: gradient from blush to cream
 * - dark: warm dark bg for high contrast
 */
const BG_CLASSES = {
  default: '',
  white: 'bg-white',
  muted: 'bg-[#FFF5EE]',
  blush: 'bg-[#FFF0F4]',
  'warm-gradient': 'bg-gradient-to-b from-[#FFF0F4] to-[#FFFBF8]',
  dark: 'bg-[#2D2A26] text-white',
} as const;

interface SectionProps {
  label?: string;
  size?: keyof typeof SIZE_CLASSES;
  spacing?: keyof typeof SPACING_CLASSES;
  /** @deprecated Use `bg` instead */
  muted?: boolean;
  bg?: keyof typeof BG_CLASSES;
  divider?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, label, size = 'wide', spacing = 'standard', muted, bg, divider, children, style }, ref) => {
    const id = useId();
    // muted prop kept for backwards compat
    const resolvedBg = bg || (muted ? 'muted' : 'default');

    return (
      <section
        ref={ref}
        className={cn(
          SPACING_CLASSES[spacing],
          BG_CLASSES[resolvedBg],
          divider && 'border-t border-[#F0E6DC]',
        )}
        style={style}
        aria-labelledby={label ? id : undefined}
      >
        {label && <span id={id} className="sr-only">{label}</span>}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className={cn('mx-auto px-5', SIZE_CLASSES[size], className)}
        >
          {children}
        </motion.div>
      </section>
    );
  },
);
Section.displayName = 'Section';
