import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ctk-badge>` — a small pill label for status or counts. Outlined in
 * `panel-ink` like every other panel in the system.
 *
 * @slot - The badge text.
 */
@customElement('ctk-badge')
export class CtkBadge extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    span {
      display: inline-flex;
      align-items: center;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      line-height: 1;
      padding: 4px 10px;
      border: 2px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-pill, 999px);
      background: var(--ctk-bg-soft, #ffffff);
      color: var(--ctk-ink, #2b2740);
    }
    :host([variant='accent']) span {
      background: var(--ctk-accent, #7c5cff);
      color: #ffffff;
    }
    :host([variant='danger']) span {
      background: var(--ctk-danger, #ff5a7a);
      color: #ffffff;
    }
    :host([variant='muted']) span {
      background: var(--ctk-accent-soft, #efe9ff);
      color: var(--ctk-ink-soft, #5c5675);
    }
  `;

  /** `default` | `accent` | `danger` | `muted` */
  @property({ reflect: true }) variant: 'default' | 'accent' | 'danger' | 'muted' = 'default';

  render() {
    return html`<span><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-badge': CtkBadge;
  }
}
