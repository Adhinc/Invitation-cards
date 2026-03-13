import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CheckListProps {
  items: string[];
  color?: string;
  className?: string;
}

export function CheckList({ items, color = 'var(--color-primary)', className }: CheckListProps) {
  return (
    <ul className={cn('space-y-3', className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span
            className="w-5 h-5 rounded-full text-white flex items-center justify-center shrink-0 mt-0.5"
            style={{ backgroundColor: color }}
          >
            <Check size={12} strokeWidth={3} />
          </span>
          <span className="text-sm text-[var(--color-text-secondary)]">{item}</span>
        </li>
      ))}
    </ul>
  );
}
