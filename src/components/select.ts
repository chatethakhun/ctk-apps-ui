import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface CtkSelectOption {
  value: string;
  label: string;
  /** Any valid CSS `background` value — a color, `url(...)`, a gradient.
   * This is the whole point of this component over a native `<select>`,
   * which cannot render anything but text inside an `<option>`. */
  icon?: string;
}

/**
 * `<ctk-select>` — a custom listbox, not a native `<select>`, specifically
 * so every option can carry an icon or image swatch (set `icon` on each
 * option to any CSS `background` value). Same panel-ink border and
 * halftone shadow as everything else in the system.
 *
 * @fires ctk-change - detail: `{ value: string }`
 */
@customElement('ctk-select')
export class CtkSelect extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    label {
      font-weight: 700;
      font-size: 0.76rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--ctk-ink, #2b2740);
    }
    .hint {
      font-size: 0.74rem;
      color: var(--ctk-ink-soft, #5c5675);
    }
    .cselect {
      position: relative;
    }
    .trigger {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      cursor: pointer;
      font: inherit;
      font-size: 0.9rem;
      color: var(--ctk-ink, #2b2740);
      background: var(--ctk-bg-soft, #ffffff);
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-panel, 4px);
      padding: 10px 12px;
    }
    .trigger .arrow {
      width: 16px;
      height: 16px;
      margin-left: auto;
      flex: none;
      transition: transform 0.15s ease;
    }
    .trigger[aria-expanded='true'] .arrow {
      transform: rotate(180deg);
    }
    .current {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .current.placeholder {
      color: var(--ctk-ink-soft, #5c5675);
      font-style: italic;
    }
    .opt-icon {
      width: 24px;
      height: 24px;
      border-radius: 5px;
      border: 2px solid var(--ctk-panel-ink, #1a1725);
      flex: none;
      background-size: cover;
      background-position: center;
    }
    .panel-shadow {
      position: absolute;
      left: 0;
      right: 0;
      top: calc(100% + 10px);
      height: 0;
    }
    .panel-shadow::before {
      content: '';
      position: absolute;
      inset: 0;
      transform: translate(5px, 5px);
      background-image: radial-gradient(var(--ctk-dot-color, rgba(26, 23, 37, 0.55)) 1.2px, transparent 1.4px);
      background-size: 5px 5px;
      border-radius: 6px;
    }
    .listbox {
      list-style: none;
      margin: 0;
      padding: 6px;
      position: absolute;
      left: 0;
      right: 0;
      top: calc(100% + 10px);
      z-index: 30;
      background: var(--ctk-bg-soft, #ffffff);
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: 4px;
      max-height: 280px;
      overflow-y: auto;
    }
    .option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.88rem;
      color: var(--ctk-ink, #2b2740);
    }
    .option:hover,
    .option.active {
      background: var(--ctk-accent-soft, #efe9ff);
    }
    .option[aria-selected='true'] {
      font-weight: 700;
    }
    .option[aria-selected='true']::after {
      content: '✓';
      margin-left: auto;
      padding-left: 8px;
      color: var(--accent, var(--ctk-accent, #7c5cff));
      font-weight: 700;
      flex: none;
    }
  `;

  @property() label = '';
  @property() hint = '';
  @property() value = '';
  @property() placeholder = 'Select an option';
  @property({ attribute: false }) options: CtkSelectOption[] = [];

  @state() private _open = false;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.#onDocClick);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.#onDocClick);
    super.disconnectedCallback();
  }

  render() {
    const selected = this.options.find((o) => o.value === this.value);
    return html`
      <div class="field">
        ${this.label ? html`<label id="lbl">${this.label}</label>` : null}
        <div class="cselect">
          <button
            type="button"
            class="trigger"
            aria-haspopup="listbox"
            aria-expanded=${this._open}
            aria-labelledby="lbl"
            @click=${this.#toggle}
          >
            <span class="current ${selected ? '' : 'placeholder'}">
              ${selected?.icon ? html`<span class="opt-icon" style="background:${selected.icon}"></span>` : nothing}
              <span>${selected ? selected.label : this.placeholder}</span>
            </span>
            <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="var(--ctk-panel-ink, #1a1725)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div class="panel-shadow" aria-hidden="true"></div>
          <ul class="listbox" role="listbox" ?hidden=${!this._open}>
            ${this.options.map(
              (opt) => html`
                <li
                  class="option"
                  role="option"
                  tabindex="0"
                  aria-selected=${opt.value === this.value}
                  @click=${(e: Event) => this.#choose(e, opt)}
                  @keydown=${(e: KeyboardEvent) => this.#onOptionKeydown(e, opt)}
                >
                  ${opt.icon ? html`<span class="opt-icon" style="background:${opt.icon}"></span>` : nothing}
                  <span>${opt.label}</span>
                </li>
              `,
            )}
          </ul>
        </div>
        ${this.hint ? html`<span class="hint">${this.hint}</span>` : null}
      </div>
    `;
  }

  #toggle(e: Event) {
    e.stopPropagation();
    this._open = !this._open;
  }

  #choose(e: Event, opt: CtkSelectOption) {
    e.stopPropagation();
    this.value = opt.value;
    this._open = false;
    this.dispatchEvent(new CustomEvent('ctk-change', { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  #onOptionKeydown(e: KeyboardEvent, opt: CtkSelectOption) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.#choose(e, opt);
    } else if (e.key === 'Escape') {
      this._open = false;
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = this.options.indexOf(opt);
      const nextIdx = e.key === 'ArrowDown' ? idx + 1 : idx - 1;
      const next = this.shadowRoot?.querySelectorAll('.option')[nextIdx] as HTMLElement | undefined;
      next?.focus();
    }
  }

  #onDocClick = (e: Event) => {
    if (!e.composedPath().includes(this)) {
      this._open = false;
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-select': CtkSelect;
  }
}
