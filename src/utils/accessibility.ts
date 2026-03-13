/** Tailwind class string for screen-reader-only elements */
export const srOnly = 'sr-only';

/**
 * Creates a visually hidden live region announcement.
 * Append the returned element to the DOM; remove after ~1s.
 */
export function announceToScreenReader(message: string): void {
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.setAttribute('aria-atomic', 'true');
  el.className = 'sr-only';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}
