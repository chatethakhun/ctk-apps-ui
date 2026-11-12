import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ctk-checkbox>` — thick outline, fills with an accent color when
 * checked, a checkmark icon fades/scales in.
 *
 * @fires ctk-change - detail: `{ checked: boolean }`
 */
@customElement('ctk-checkbox')
export class CtkCheckbox extends LitElement {
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
    .box {
      width: 22px;
      height: 22px;
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: 5px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      background: var(--ctk-bg-soft, #ffffff);
      transition: background 0.15s ease;
    }
    input:checked + .box {
      background: var(--accent, var(--ctk-accent, #7c5cff));
    }
    input:focus-visible + .box {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 2px;
    }
    svg {
      width: 14px;
      height: 14px;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.15s ease;
      stroke: #fff;
    }
    input:checked + .box svg {
      opacity: 1;
      transform: scale(1);
    }
  `;

  @property() label = '';
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  render() {
    return html`
      <label aria-disabled=${this.disabled}>
        <input type="checkbox" .checked=${this.checked} ?disabled=${this.disabled} @change=${this.#onChange} />
        <span class="box">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12l5 5 9-10" />
          </svg>
        </span>
        <slot>${this.label}</slot>
      </label>
    `;
  }

  #onChange(e: Event) {
    this.checked = (e.target as HTMLInputElement).checked;
    this.dispatchEvent(
      new CustomEvent('ctk-change', { detail: { checked: this.checked }, bubbles: true, composed: true }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-checkbox': CtkCheckbox;
  }
}
