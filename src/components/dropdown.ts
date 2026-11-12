import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

/**
 * `<ctk-dropdown>` — a trigger button that opens a menu of actions.
 * Put `<button role="menuitem">` elements in the default slot; each one
 * should carry a `value`, which is reported when chosen.
 *
 * Keyboard: Enter/Space/ArrowDown opens, ArrowUp/ArrowDown move, Home/End
 * jump, Enter/Space chooses, Escape or clicking outside closes.
 *
 * @slot - Menu items (`<button role="menuitem" value="...">`).
 * @fires ctk-select - detail: `{ value: string }`
 */
@customElement('ctk-dropdown')
export class CtkDropdown extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    .trigger {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--ctk-ink, #2b2740);
      background: var(--ctk-bg-soft, #ffffff);
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-pill, 999px);
      padding: 7px 14px;
      cursor: pointer;
    }
    .trigger:focus-visible {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 2px;
    }
    .trigger:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .chevron {
      transition: transform 0.15s ease;
    }
    .trigger[aria-expanded='true'] .chevron {
      transform: rotate(180deg);
    }
    .menu {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      min-width: 180px;
      margin: 0;
      padding: 6px;
      list-style: none;
      display: none;
      flex-direction: column;
      gap: 2px;
      background: var(--ctk-bg-soft, #ffffff);
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-card, 6px);
      box-shadow: 4px 4px 0 var(--ctk-panel-ink, #1a1725);
      z-index: 100;
    }
    .menu.open {
      display: flex;
    }
    ::slotted([role='menuitem']) {
      all: unset;
      box-sizing: border-box;
      display: block;
      width: 100%;
      padding: 8px 10px;
      border-radius: 4px;
      font-size: 0.88rem;
      color: var(--ctk-ink, #2b2740);
      cursor: pointer;
    }
    ::slotted([role='menuitem']:hover),
    ::slotted([role='menuitem']:focus-visible),
    ::slotted([role='menuitem'].active) {
      background: var(--ctk-accent-soft, #efe9ff);
      outline: none;
    }
  `;

  @property() label = 'Actions';
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('.trigger') private trigger!: HTMLButtonElement;

  #active = -1;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.#onOutside);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.#onOutside);
  }

  #items(): HTMLElement[] {
    return Array.from(this.querySelectorAll<HTMLElement>('[role="menuitem"]'));
  }

  #setActive(index: number) {
    const items = this.#items();
    if (items.length === 0) return;
    this.#active = (index + items.length) % items.length;
    items.forEach((el, i) => el.classList.toggle('active', i === this.#active));
    items[this.#active].focus();
  }

  #openMenu(focusFirst = false) {
    if (this.disabled) return;
    this.open = true;
    if (focusFirst) this.#setActive(0);
  }

  #close(returnFocus = true) {
    this.open = false;
    this.#active = -1;
    this.#items().forEach((el) => el.classList.remove('active'));
    if (returnFocus) this.trigger.focus();
  }

  #choose(item: HTMLElement) {
    this.dispatchEvent(
      new CustomEvent('ctk-select', {
        detail: { value: item.getAttribute('value') ?? item.textContent?.trim() ?? '' },
        bubbles: true,
        composed: true,
      }),
    );
    this.#close();
  }

  #onOutside = (e: MouseEvent) => {
    if (this.open && !e.composedPath().includes(this)) this.#close(false);
  };

  #onTriggerKey(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.#openMenu(true);
    }
  }

  #onMenuKey(e: KeyboardEvent) {
    const items = this.#items();
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.#setActive(this.#active + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.#setActive(this.#active - 1);
        break;
      case 'Home':
        e.preventDefault();
        this.#setActive(0);
        break;
      case 'End':
        e.preventDefault();
        this.#setActive(items.length - 1);
        break;
      case 'Enter':
      case ' ': {
        e.preventDefault();
        const item = items[this.#active];
        if (item) this.#choose(item);
        break;
      }
      case 'Escape':
        e.preventDefault();
        this.#close();
        break;
      case 'Tab':
        this.#close(false);
        break;
    }
  }

  render() {
    return html`
      <button
        class="trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded=${this.open ? 'true' : 'false'}
        ?disabled=${this.disabled}
        @click=${() => (this.open ? this.#close(false) : this.#openMenu())}
        @keydown=${this.#onTriggerKey}
      >
        ${this.label}
        <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
        </svg>
      </button>
      <div
        class="menu ${this.open ? 'open' : ''}"
        role="menu"
        @keydown=${this.#onMenuKey}
        @click=${(e: Event) => {
          const item = (e.target as HTMLElement).closest<HTMLElement>('[role="menuitem"]');
          if (item) this.#choose(item);
        }}
      >
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-dropdown': CtkDropdown;
  }
}
