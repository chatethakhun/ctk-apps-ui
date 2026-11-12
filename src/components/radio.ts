import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ctk-radio>` — same thick-outline treatment as the checkbox, a filled
 * dot when selected. Radios sharing the same `name` are mutually
 * exclusive, the same way native radio inputs work — but since each
 * instance lives in its own shadow root, the exclusivity is coordinated
 * in JS rather than relying on native cross-shadow-root grouping (which
 * browsers don't actually do for separate custom elements).
 *
 * @fires ctk-change - detail: `{ value: string }`, fired on the radio
 *   that became checked (not on the ones it unchecked).
 */
@customElement('ctk-radio')
export class CtkRadio extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.88rem;
      cursor: pointer;
      color: var(--ctk-ink, #2b2740);
    }
    label[aria-disabled='true'] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
    .dot {
      width: 22px;
      height: 22px;
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      background: var(--ctk-bg-soft, #ffffff);
    }
    .dot::after {
      content: '';
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: transparent;
      transition: background 0.15s ease;
    }
    input:checked + .dot::after {
      background: var(--accent, var(--ctk-accent, #7c5cff));
    }
    input:focus-visible + .dot {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 2px;
    }
  `;

  /** Groups radios together — only one per `name` can be checked at a time. */
  @property() name = '';
  /** This radio's value, reported in `ctk-change`. */
  @property() value = '';
  @property() label = '';
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  render() {
    return html`
      <label aria-disabled=${this.disabled}>
        <input type="radio" .checked=${this.checked} ?disabled=${this.disabled} @change=${this.#onChange} />
        <span class="dot"></span>
        <slot>${this.label}</slot>
      </label>
    `;
  }

  #onChange(e: Event) {
    if (!(e.target as HTMLInputElement).checked) return;
    this.checked = true;
    this.#uncheckSiblings();
    this.dispatchEvent(
      new CustomEvent('ctk-change', { detail: { value: this.value }, bubbles: true, composed: true }),
    );
  }

  #uncheckSiblings() {
    if (!this.name) return;
    const root = this.getRootNode() as Document | ShadowRoot;
    root.querySelectorAll<CtkRadio>('ctk-radio').forEach((other) => {
      if (other !== this && other.name === this.name) {
        other.checked = false;
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-radio': CtkRadio;
  }
}
