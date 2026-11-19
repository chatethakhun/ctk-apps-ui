/**
 * Shared motion for the comic-panel components.
 *
 * Timing and easing here must match the `--ctk-motion-*` tokens in
 * `tokens.css`, which the CSS-driven components (modal, tooltip) use.
 *
 * Every helper checks `prefers-reduced-motion` when it runs, so changing
 * that setting mid-session takes effect on the next open or close. Under
 * reduced motion the scale and overshoot are dropped and only the fade
 * remains.
 *
 * Elements stay in the DOM and are shown or hidden with the `hidden`
 * attribute, because a hidden element can wait for its exit animation.
 */

export const ENTER_MS = 200;
export const EXIT_MS = 140;
export const POP_EASING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
export const EXIT_EASING = 'ease-in';

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const POP_IN: Keyframe[] = [
  { opacity: 0, transform: 'scale(0.92)' },
  { opacity: 1, transform: 'scale(1.03)', offset: 0.7 },
  { opacity: 1, transform: 'scale(1)' },
];
const POP_OUT: Keyframe[] = [
  { opacity: 1, transform: 'scale(1)' },
  { opacity: 0, transform: 'scale(0.94)' },
];
const FADE_IN: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }];
const FADE_OUT: Keyframe[] = [{ opacity: 1 }, { opacity: 0 }];
const SLIDE_LEFT_IN: Keyframe[] = [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }];
const SLIDE_LEFT_OUT: Keyframe[] = [{ transform: 'translateX(0)' }, { transform: 'translateX(-100%)' }];
export const SLIDE_EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

/**
 * - `pop`: scale with overshoot (modals, menus, popovers).
 * - `slide-left`: slide in from the left edge (drawers).
 * - `fade`: opacity only (backdrops).
 * Under reduced motion every variant becomes a plain fade.
 */
export type PresenceVariant = 'pop' | 'slide-left' | 'fade';

const running = new WeakMap<HTMLElement, Animation>();

/**
 * Shows or hides an element with the given variant. The element must carry the
 * `hidden` attribute in its markup (so it starts hidden) and must not bind
 * `hidden` through Lit, or Lit will hide it before the exit can play.
 */
export function setPresence(el: HTMLElement | null | undefined, open: boolean, variant: PresenceVariant = 'pop'): void {
  if (!el) return;
  running.get(el)?.cancel();
  running.delete(el);
  const reduced = prefersReducedMotion();
  const inFrames = reduced || variant === 'fade' ? FADE_IN : variant === 'slide-left' ? SLIDE_LEFT_IN : POP_IN;
  const outFrames = reduced || variant === 'fade' ? FADE_OUT : variant === 'slide-left' ? SLIDE_LEFT_OUT : POP_OUT;
  const easeIn = reduced ? 'linear' : variant === 'slide-left' ? SLIDE_EASING : POP_EASING;
  const easeOut = variant === 'slide-left' && !reduced ? 'ease-in' : EXIT_EASING;

  if (open) {
    el.hidden = false;
    running.set(el, el.animate(inFrames, { duration: ENTER_MS, easing: easeIn }));
    return;
  }

  if (el.hidden) return;
  const anim = el.animate(outFrames, { duration: EXIT_MS, easing: easeOut, fill: 'forwards' });
  running.set(el, anim);
  anim.onfinish = () => {
    running.delete(el);
    anim.cancel();
    el.hidden = true;
  };
}

/**
 * Plays the enter animation on an element that is not owned by a Lit
 * template (for example a toast appended to a region on `document.body`).
 */
export function playEnter(el: Element): void {
  const reduced = prefersReducedMotion();
  el.animate(reduced ? FADE_IN : POP_IN, {
    duration: ENTER_MS,
    easing: reduced ? 'linear' : POP_EASING,
  });
}

/** Plays the exit animation and resolves once it finishes. */
export function playExit(el: Element): Promise<void> {
  const reduced = prefersReducedMotion();
  const anim = el.animate(reduced ? FADE_OUT : POP_OUT, {
    duration: EXIT_MS,
    easing: EXIT_EASING,
    fill: 'forwards',
  });
  return anim.finished.then(
    () => undefined,
    () => undefined, // cancelled, e.g. the element was removed mid-animation
  );
}
