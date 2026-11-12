import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ctk-accordion>` — a stack of collapsible sections. Put native
 * `<details>` elements with a `<summary>` in the default slot. Set
 * `exclusive` so opening one section closes the others.
 *
 * @slot - `<details>` items, each with a `<summary>` heading.
 */
@customElement('ctk-accordion')
export class CtkAccordion extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
      color: var(--ctk-ink, #2b2740);
    }
    ::slotted(details) {
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-card, 6px);
      background: var(--ctk-bg-soft, #ffffff);
      margin-bottom: 10px;
      padding: 8px 16px 14px;
      overflow: hidden;
    }
    ::slotted(details[open]) {
      box-shadow: 4px 4px 0 var(--ctk-panel-ink, #1a1725);
    }
    ::slotted(summary) {
      cursor: pointer;
      /* Pull the header back out to the card edges so its hover and focus
         states fill the full width, while the text stays aligned with the
         16px gutter that the card's padding sets. */
      margin: 0 -16px;
      padding: 12px 16px;
      font-weight: 700;
      font-size: 0.95rem;
      list-style: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    ::slotted(summary:focus-visible) {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: -4px;
    }
  `;

  /** Opening one section closes the others. */
  @property({ type: Boolean }) exclusive = false;

  connectedCallback() {
    super.connectedCallback();
    // `toggle` does not bubble, so listen in the capture phase on the host.
    this.addEventListener('toggle', this.#onToggle, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('toggle', this.#onToggle, true);
  }

  render() {
    return html`<slot></slot>`;
  }

  #onToggle = (e: Event) => {
    if (!this.exclusive) return;
    const target = e.target as HTMLDetailsElement;
    if (target.tagName !== 'DETAILS' || !target.open) return;
    this.querySelectorAll<HTMLDetailsElement>(':scope > details').forEach((d) => {
      if (d !== target) d.open = false;
    });
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-accordion': CtkAccordion;
  }
}
