import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export type CtkTooltipPlacement = 'top' | 'bottom';

/**
 * `<ctk-tooltip>` — a short hint shown on hover or keyboard focus of its
 * content. Wrap a single focusable element (button, link, input).
 *
 * The bubble is linked to the trigger via `aria-describedby`, so screen
 * readers announce the text too. Escape hides it.
 *
 * @slot - The element that triggers the tooltip.
 */
@customElement('ctk-tooltip')
export class CtkTooltip extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    .bubble {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
      padding: 6px 10px;
      border: 2px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-card, 6px);
      background: var(--ctk-panel-ink, #1a1725);
      color: var(--ctk-bg-soft, #ffffff);
      font-size: 0.78rem;
      font-weight: 600;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.12s ease, visibility 0.12s ease;
      z-index: 200;
    }
    :host([placement='top']) .bubble,
    .bubble.top {
      bottom: calc(100% + 8px);
    }
    .bubble.bottom {
      top: calc(100% + 8px);
    }
    .bubble.show {
      opacity: 1;
      visibility: visible;
    }
  `;

  @property({ reflect: true }) placement: CtkTooltipPlacement = 'top';
  @property() text = '';
  @property({ type: Number, attribute: 'delay' }) delay = 150;

  @state() private visible = false;
  #timer?: number;
  #id = `ctk-tooltip-${Math.random().toString(36).slice(2, 9)}`;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('pointerenter', this.#show);
    this.addEventListener('pointerleave', this.#hide);
    this.addEventListener('focusin', this.#show);
    this.addEventListener('focusout', this.#hide);
    this.addEventListener('keydown', this.#onKey);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('pointerenter', this.#show);
    this.removeEventListener('pointerleave', this.#hide);
    this.removeEventListener('focusin', this.#show);
    this.removeEventListener('focusout', this.#hide);
    this.removeEventListener('keydown', this.#onKey);
    window.clearTimeout(this.#timer);
  }

  #show = () => {
    window.clearTimeout(this.#timer);
    this.#timer = window.setTimeout(() => (this.visible = true), this.delay);
  };

  #hide = () => {
    window.clearTimeout(this.#timer);
    this.visible = false;
  };

  #onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.#hide();
  };

  render() {
    return html`
      <slot aria-describedby=${this.#id}></slot>
      <span id=${this.#id} role="tooltip" class="bubble ${this.placement} ${this.visible ? 'show' : ''}">
        ${this.text}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-tooltip': CtkTooltip;
  }
}
