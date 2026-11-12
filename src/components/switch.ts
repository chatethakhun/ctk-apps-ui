import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ctk-switch>` — an on/off toggle for settings that take effect
 * immediately. Use `<ctk-checkbox>` for form values submitted later.
 *
 * @slot - Label text, shown beside the track.
 * @fires ctk-change - detail: `{ checked: boolean }`
 */
@customElement('ctk-switch')
export class CtkSwitch extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    button {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 0.88rem;
      color: var(--ctk-ink, #2b2740);
      cursor: pointer;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    button:focus-visible .track {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 2px;
    }
    .track {
      position: relative;
      width: 48px;
      height: 24px;
      flex: none;
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-pill, 999px);
      background: var(--ctk-bg-soft, #ffffff);
      transition: background 0.15s ease;
    }
    .thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--ctk-panel-ink, #1a1725);
      transition: transform 0.15s ease;
    }
    button[aria-checked='true'] .track {
      background: var(--accent, var(--ctk-accent, #7c5cff));
    }
    button[aria-checked='true'] .thumb {
      transform: translateX(24px);
      background: #ffffff;
    }
  `;

  @property() label = '';
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  render() {
    return html`
      <button
        type="button"
        role="switch"
        aria-checked=${this.checked ? 'true' : 'false'}
        ?disabled=${this.disabled}
        @click=${this.#toggle}
      >
        <span class="track"><span class="thumb"></span></span>
        <slot>${this.label}</slot>
      </button>
    `;
  }

  #toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(
      new CustomEvent('ctk-change', { detail: { checked: this.checked }, bubbles: true, composed: true }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-switch': CtkSwitch;
  }
}
