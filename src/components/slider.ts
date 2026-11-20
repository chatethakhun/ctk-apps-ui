import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ctk-slider>` — a range input styled to the comic-panel look. The filled
 * part of the track uses the accent colour up to the current value.
 *
 * Keyboard and screen-reader behaviour come from the native range input.
 *
 * @fires ctk-input - detail: `{ value: number }`, while dragging
 * @fires ctk-change - detail: `{ value: number }`, when the drag or key press settles
 */
@customElement('ctk-slider')
export class CtkSlider extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
      color: var(--ctk-ink, #2b2740);
    }
    .head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 8px;
      font-size: 0.82rem;
      font-weight: 700;
    }
    output {
      font-family: var(--ctk-font-display, 'Bangers', sans-serif);
      font-size: 1.1rem;
      letter-spacing: 0.03em;
      font-variant-numeric: tabular-nums;
    }
    input[type='range'] {
      --pct: 0%;
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 22px;
      margin: 0;
      background: transparent;
      cursor: pointer;
    }
    input[type='range']:focus {
      outline: none;
    }
    input[type='range']::-webkit-slider-runnable-track {
      height: 12px;
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-pill, 999px);
      background: linear-gradient(
        to right,
        var(--accent, var(--ctk-accent, #7c5cff)) 0 var(--pct),
        var(--ctk-bg-soft, #ffffff) var(--pct) 100%
      );
    }
    input[type='range']::-moz-range-track {
      height: 7px;
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-pill, 999px);
      background: var(--ctk-bg-soft, #ffffff);
    }
    input[type='range']::-moz-range-progress {
      height: 7px;
      border-radius: var(--ctk-radius-pill, 999px);
      background: var(--accent, var(--ctk-accent, #7c5cff));
    }
    input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 22px;
      height: 22px;
      margin-top: -7px;
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 2px 2px 0 var(--ctk-panel-ink, #1a1725);
    }
    input[type='range']::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 2px 2px 0 var(--ctk-panel-ink, #1a1725);
    }
    input[type='range']:focus-visible::-webkit-slider-thumb {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 2px;
    }
    input[type='range']:focus-visible::-moz-range-thumb {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 2px;
    }
    :host([disabled]) {
      opacity: 0.5;
    }
    :host([disabled]) input[type='range'] {
      cursor: not-allowed;
    }
  `;

  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property() label = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Show the current value next to the label. */
  @property({ type: Boolean, attribute: 'show-value' }) showValue = false;

  render() {
    const span = this.max - this.min;
    const pct = span > 0 ? ((this.value - this.min) / span) * 100 : 0;
    return html`
      ${this.label || this.showValue
        ? html`<div class="head">
            <span>${this.label}</span>
            ${this.showValue ? html`<output aria-hidden="true">${this.value}</output>` : nothing}
          </div>`
        : nothing}
      <input
        type="range"
        min=${this.min}
        max=${this.max}
        step=${this.step}
        .value=${String(this.value)}
        ?disabled=${this.disabled}
        aria-label=${this.label || 'Value'}
        aria-valuetext=${String(this.value)}
        style="--pct: ${pct}%"
        @input=${this.#onInput}
        @change=${this.#onChange}
      />
    `;
  }

  #onInput(e: Event) {
    this.value = Number((e.target as HTMLInputElement).value);
    this.dispatchEvent(new CustomEvent('ctk-input', { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  #onChange(e: Event) {
    this.value = Number((e.target as HTMLInputElement).value);
    this.dispatchEvent(new CustomEvent('ctk-change', { detail: { value: this.value }, bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-slider': CtkSlider;
  }
}
