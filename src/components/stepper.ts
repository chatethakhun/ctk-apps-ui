import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { clamp, snapToStep } from '../number-utils.js';
import { baseStyles } from '../shared-styles.js';

/**
 * `<ctk-stepper>` — a `−` / `+` control for a whole number or step value.
 * Use `orientation="horizontal"` (`[−] 3 [+]`) or `orientation="vertical"`
 * (`[+]` above the value, `[−]` below it).
 *
 * Keyboard: Arrow keys change the value when the stepper has focus. Buttons
 * are disabled at `min` and `max`.
 *
 * @fires ctk-change - detail: `{ value: number }`
 */
@customElement('ctk-stepper')
export class CtkStepper extends LitElement {
  static styles = css`
    ${baseStyles}
    :host {
      display: inline-block;
      max-width: 100%;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
      color: var(--ctk-ink, #2b2740);
    }
    .wrap {
      display: inline-flex;
      max-width: 100%;
      align-items: center;
      gap: 8px;
      outline: none;
      border-radius: var(--ctk-radius-pill, 999px);
    }
    :host(:focus-within) .wrap,
    .wrap:focus-visible {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 3px;
    }
    .wrap[data-orientation='vertical'] {
      flex-direction: column;
    }
    button {
      all: unset;
      box-sizing: border-box;
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.2rem;
      font-weight: 700;
      line-height: 1;
      background: var(--ctk-bg-soft, #ffffff);
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-pill, 999px);
      box-shadow: 2px 2px 0 var(--ctk-panel-ink, #1a1725);
    }
    button:hover:not(:disabled) {
      background: var(--ctk-accent-soft, #efe9ff);
    }
    button:active:not(:disabled) {
      transform: translate(2px, 2px);
      box-shadow: none;
    }
    button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    button:focus-visible {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 2px;
    }
    output {
      min-width: 48px;
      text-align: center;
      font-family: var(--ctk-font-display, 'Bangers', sans-serif);
      font-size: 1.5rem;
      letter-spacing: 0.03em;
      font-variant-numeric: tabular-nums;
    }
    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }
  `;

  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 10;
  @property({ type: Number }) step = 1;
  @property({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Accessible name, for example "Quantity". */
  @property() label = 'Value';

  render() {
    const atMin = this.value <= this.min;
    const atMax = this.value >= this.max;
    const dec = this.#dec();
    return html`
      <div class="wrap" role="group" aria-label=${this.label} data-orientation=${this.orientation} tabindex="0"
        @keydown=${this.#onKey}>
        ${this.orientation === 'vertical'
          ? html`<button type="button" aria-label="Increase ${this.label}" ?disabled=${this.disabled || atMax} @click=${() => this.#step(1)}>+</button>`
          : html`<button type="button" aria-label="Decrease ${this.label}" ?disabled=${this.disabled || atMin} @click=${() => this.#step(-1)}>−</button>`}
        <output aria-live="polite">${this.value.toFixed(dec)}</output>
        ${this.orientation === 'vertical'
          ? html`<button type="button" aria-label="Decrease ${this.label}" ?disabled=${this.disabled || atMin} @click=${() => this.#step(-1)}>−</button>`
          : html`<button type="button" aria-label="Increase ${this.label}" ?disabled=${this.disabled || atMax} @click=${() => this.#step(1)}>+</button>`}
      </div>
    `;
  }

  #dec(): number {
    const s = String(this.step);
    return (s.split('.')[1] ?? '').length;
  }

  #step(direction: 1 | -1) {
    if (this.disabled) return;
    const next = clamp(snapToStep(this.value + direction * this.step, this.min, this.step), this.min, this.max);
    if (next === this.value) return;
    this.value = next;
    this.dispatchEvent(new CustomEvent('ctk-change', { detail: { value: next }, bubbles: true, composed: true }));
  }

  #onKey(e: KeyboardEvent) {
    const up = e.key === 'ArrowUp' || e.key === 'ArrowRight';
    const down = e.key === 'ArrowDown' || e.key === 'ArrowLeft';
    if (!up && !down) return;
    e.preventDefault();
    this.#step(up ? 1 : -1);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-stepper': CtkStepper;
  }
}
