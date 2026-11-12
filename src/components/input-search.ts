import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

/**
 * `<ctk-input-search>` — a search field with a leading icon and a clear
 * button that appears once there is text. Pressing Enter fires
 * `ctk-search`. Escape clears the field.
 *
 * @fires ctk-input - detail: `{ value: string }`, on every keystroke
 * @fires ctk-search - detail: `{ value: string }`, on Enter
 * @fires ctk-clear - no payload, after the field is cleared
 */
@customElement('ctk-input-search')
export class CtkInputSearch extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    .field {
      position: relative;
      display: flex;
      align-items: center;
    }
    .icon {
      position: absolute;
      left: 12px;
      width: 16px;
      height: 16px;
      color: var(--ctk-ink-soft, #5c5675);
      pointer-events: none;
    }
    input {
      box-sizing: border-box;
      width: 100%;
      padding: 9px 36px 9px 36px;
      font: inherit;
      font-size: 0.9rem;
      color: var(--ctk-ink, #2b2740);
      background: var(--ctk-bg-soft, #ffffff);
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-pill, 999px);
      outline: none;
    }
    input::placeholder {
      color: var(--ctk-ink-soft, #5c5675);
    }
    input:focus-visible {
      box-shadow: 0 0 0 3px var(--ctk-accent-soft, #efe9ff);
      border-color: var(--ctk-accent, #7c5cff);
    }
    .clear {
      all: unset;
      position: absolute;
      right: 10px;
      width: 22px;
      height: 22px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      font-weight: 700;
      color: var(--ctk-ink-soft, #5c5675);
    }
    .clear:hover {
      background: var(--ctk-accent-soft, #efe9ff);
    }
    .clear:focus-visible {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 1px;
    }
  `;

  @property() value = '';
  @property() placeholder = 'Search';
  @property() label = 'Search';

  @query('input') private input!: HTMLInputElement;

  render() {
    return html`
      <div class="field">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <input
          type="search"
          role="searchbox"
          aria-label=${this.label}
          placeholder=${this.placeholder}
          .value=${this.value}
          @input=${this.#onInput}
          @keydown=${this.#onKey}
        />
        ${this.value
          ? html`<button class="clear" type="button" aria-label="Clear search" @click=${this.#clear}>×</button>`
          : nothing}
      </div>
    `;
  }

  #onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this.#emit('ctk-input', { value: this.value });
  }

  #onKey(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.#emit('ctk-search', { value: this.value });
    } else if (e.key === 'Escape' && this.value) {
      e.preventDefault();
      this.#clear();
    }
  }

  #clear() {
    this.value = '';
    this.input.value = '';
    this.input.focus();
    this.dispatchEvent(new CustomEvent('ctk-clear', { bubbles: true, composed: true }));
  }

  #emit(name: string, detail: unknown) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-input-search': CtkInputSearch;
  }
}
