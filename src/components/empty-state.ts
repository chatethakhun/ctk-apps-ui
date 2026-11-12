import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ctk-empty-state>` — shown when a list or page has nothing to display.
 * Give it a `heading`, optional body text in the default slot, and
 * action buttons in the `action` slot.
 *
 * @slot - Description text.
 * @slot action - Optional call-to-action, e.g. a `<ctk-button>`.
 */
@customElement('ctk-empty-state')
export class CtkEmptyState extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
      color: var(--ctk-ink, #2b2740);
    }
    .wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 10px;
      padding: 32px 24px;
      border: 2.5px dashed var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-card, 6px);
      background: var(--ctk-bg-soft, #ffffff);
    }
    .icon {
      width: 48px;
      height: 48px;
      color: var(--ctk-accent, #7c5cff);
    }
    h3 {
      margin: 4px 0 0;
      font-family: var(--ctk-font-display, 'Bangers', sans-serif);
      font-size: 1.6rem;
      font-weight: 400;
      letter-spacing: 0.03em;
    }
    .body {
      margin: 0;
      max-width: 36ch;
      font-size: 0.9rem;
      line-height: 1.5;
      color: var(--ctk-ink-soft, #5c5675);
    }
    .action {
      margin-top: 8px;
    }
  `;

  @property() heading = 'Nothing here yet';

  render() {
    return html`
      <div class="wrap">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 10h18" />
        </svg>
        <h3>${this.heading}</h3>
        <p class="body"><slot></slot></p>
        <div class="action"><slot name="action"></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-empty-state': CtkEmptyState;
  }
}
