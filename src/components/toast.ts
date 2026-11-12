import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type CtkToastVariant = 'info' | 'success' | 'warning' | 'danger';

/**
 * `<ctk-toast>` — a single notification bubble. Usually created through
 * `showToast()` rather than placed in markup, which stacks toasts in a
 * fixed corner of the page and removes them when they dismiss.
 *
 * @slot - Message content (plain text is fine).
 * @fires ctk-dismiss - Fired once the toast is removed, no payload.
 */
@customElement('ctk-toast')
export class CtkToast extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
      animation: pop-in 0.18s ease-out;
    }
    @keyframes pop-in {
      from { opacity: 0; transform: translateY(8px) scale(0.97); }
      to { opacity: 1; transform: none; }
    }
    .toast {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      min-width: 240px;
      max-width: 360px;
      padding: 12px 14px;
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-card, 6px);
      background: var(--ctk-bg-soft, #ffffff);
      color: var(--ctk-ink, #2b2740);
      box-shadow: 4px 4px 0 var(--ctk-panel-ink, #1a1725);
      font-size: 0.88rem;
      line-height: 1.4;
    }
    .dot {
      width: 12px;
      height: 12px;
      margin-top: 4px;
      flex: none;
      border: 2px solid var(--ctk-panel-ink, #1a1725);
      border-radius: 50%;
      background: var(--ctk-accent, #7c5cff);
    }
    :host([variant='success']) .dot { background: #3ecf8e; }
    :host([variant='warning']) .dot { background: #ffc233; }
    :host([variant='danger']) .dot { background: var(--ctk-danger, #ff5a7a); }
    .message {
      flex: 1;
    }
    .close {
      all: unset;
      cursor: pointer;
      font-weight: 700;
      padding: 0 2px;
      color: var(--ctk-ink-soft, #5c5675);
    }
    .close:focus-visible {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 2px;
    }
  `;

  @property({ reflect: true }) variant: CtkToastVariant = 'info';
  /** Milliseconds before auto-dismiss. `0` keeps it until closed by hand. */
  @property({ type: Number }) duration = 4000;

  #timer?: number;

  connectedCallback() {
    super.connectedCallback();
    if (this.duration > 0) {
      this.#timer = window.setTimeout(() => this.dismiss(), this.duration);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearTimeout(this.#timer);
  }

  render() {
    return html`
      <div class="toast" role=${this.variant === 'danger' ? 'alert' : 'status'}>
        <span class="dot"></span>
        <span class="message"><slot></slot></span>
        <button class="close" type="button" aria-label="Dismiss" @click=${this.dismiss}>×</button>
      </div>
    `;
  }

  dismiss = () => {
    window.clearTimeout(this.#timer);
    this.remove();
    this.dispatchEvent(new CustomEvent('ctk-dismiss', { bubbles: true, composed: true }));
  };
}

/**
 * Show a toast in the top-right corner. Returns the element so callers can
 * dismiss it early with `toast.dismiss()`.
 */
export function showToast(
  message: string,
  options: { variant?: CtkToastVariant; duration?: number } = {},
): CtkToast {
  let region = document.querySelector<HTMLElement>('.ctk-toast-region');
  if (!region) {
    region = document.createElement('div');
    region.className = 'ctk-toast-region';
    Object.assign(region.style, {
      position: 'fixed',
      top: '16px',
      right: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: '1000',
    });
    document.body.appendChild(region);
  }
  const toast = document.createElement('ctk-toast') as CtkToast;
  toast.variant = options.variant ?? 'info';
  if (options.duration !== undefined) toast.duration = options.duration;
  toast.textContent = message;
  region.appendChild(toast);
  return toast;
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-toast': CtkToast;
  }
}
