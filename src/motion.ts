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

const running = new WeakMap<HTMLElement, Animation>();

/**
 * Shows or hides an element with the comic pop. The element must carry the
 * `hidden` attribute in its markup (so it starts hidden) and must not bind
 * `hidden` through Lit, or Lit will hide it before the exit can play.
 */
export function setPresence(el: HTMLElement | null | undefined, open: boolean): void {
  if (!el) return;
  running.get(el)?.cancel();
  running.delete(el);
  const reduced = prefersReducedMotion();

  if (open) {
    el.hidden = false;
    running.set(
      el,
      el.animate(reduced ? FADE_IN : POP_IN, {
        duration: ENTER_MS,
        easing: reduced ? 'linear' : POP_EASING,
      }),
    );
    return;
  }

  if (el.hidden) return;
  const anim = el.animate(reduced ? FADE_OUT : POP_OUT, {
    duration: EXIT_MS,
    easing: EXIT_EASING,
    fill: 'forwards',
  });
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
