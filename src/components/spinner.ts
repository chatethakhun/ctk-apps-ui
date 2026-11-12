import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ctk-spinner>` — an indeterminate loading indicator. Announces its
 * `label` to screen readers.
 */
@customElement('ctk-spinner')
export class CtkSpinner extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    .ring {
      display: block;
      width: var(--size, 28px);
      height: var(--size, 28px);
      box-sizing: border-box;
      border: 3px solid var(--ctk-panel-ink-tint, rgba(26, 23, 37, 0.1));
      border-top-color: var(--accent, var(--ctk-accent, #7c5cff));
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    :host([size='sm']) .ring {
      --size: 18px;
    }
    :host([size='lg']) .ring {
      --size: 44px;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .ring {
        animation-duration: 2.4s;
      }
    }
  `;

  /** `sm` | `md` | `lg` */
  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';
  @property() label = 'Loading';

  render() {
    return html`<span class="ring" role="status" aria-label=${this.label}></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-spinner': CtkSpinner;
  }
}
