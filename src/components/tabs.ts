import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface CtkTabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * `<ctk-tabs>` — a pill-shaped segmented control (not full tab panels).
 * It only tracks and announces which tab is selected; render your own
 * panel content based on `value` / the `ctk-change` event, the same way
 * you would drive panels off any other piece of selection state.
 *
 * @fires ctk-change - detail: `{ value: string }`
 */
@customElement('ctk-tabs')
export class CtkTabs extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    .segtabs {
      display: inline-flex;
      gap: 2px;
      background: var(--ctk-bg-soft, #ffffff);
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-pill, 999px);
      padding: 3px;
    }
    button {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      padding: 7px 16px;
      border-radius: var(--ctk-radius-pill, 999px);
      font-weight: 700;
      font-size: 0.82rem;
      color: var(--ctk-ink-soft, #5c5675);
    }
    button:hover:not(:disabled):not([aria-selected='true']) {
      color: var(--ctk-ink, #2b2740);
    }
    button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    button[aria-selected='true'] {
      background: var(--ctk-panel-ink, #1a1725);
      color: var(--ctk-bg-soft, #ffffff);
    }
  `;

  @property({ attribute: false }) tabs: CtkTabItem[] = [];
  @property() value = '';

  render() {
    return html`
      <div class="segtabs" role="tablist">
        ${this.tabs.map(
          (tab) => html`
            <button
              type="button"
              role="tab"
              aria-selected=${tab.value === this.value}
              ?disabled=${tab.disabled}
              @click=${() => this.#select(tab)}
            >
              ${tab.label}
            </button>
          `,
        )}
      </div>
    `;
  }

  #select(tab: CtkTabItem) {
    if (tab.disabled || tab.value === this.value) return;
    this.value = tab.value;
    this.dispatchEvent(new CustomEvent('ctk-change', { detail: { value: this.value }, bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-tabs': CtkTabs;
  }
}
