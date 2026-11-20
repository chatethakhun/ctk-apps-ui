/** Shared numeric helpers for stepper, number field and slider. */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function decimalsOf(n: number): number {
  const [, frac = ''] = String(n).split('.');
  return frac.length;
}

/** Snaps a value to the nearest step counted from `min`, without float noise. */
export function snapToStep(value: number, min: number, step: number): number {
  if (!(step > 0)) return value;
  const steps = Math.round((value - min) / step);
  const snapped = min + steps * step;
  return Number(snapped.toFixed(Math.max(decimalsOf(step), decimalsOf(min))));
}
