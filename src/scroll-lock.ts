/**
 * Scroll lock for components that cover the page with a backdrop (modal,
 * drawer). Calls nest: the page unlocks only when every caller has released
 * its lock. Compensates for the scrollbar width so content does not jump.
 */

let count = 0;
let savedOverflow = '';
let savedPaddingRight = '';

export function lockScroll(): void {
  if (count++ > 0) return;
  const root = document.documentElement;
  const scrollbarWidth = window.innerWidth - root.clientWidth;
  savedOverflow = root.style.overflow;
  savedPaddingRight = root.style.paddingRight;
  root.style.overflow = 'hidden';
  if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;
}

export function unlockScroll(): void {
  if (count === 0 || --count > 0) return;
  const root = document.documentElement;
  root.style.overflow = savedOverflow;
  root.style.paddingRight = savedPaddingRight;
}
