import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

const STORAGE_KEY = 'ctk-ui-theme';

/**
 * `<ctk-theme-toggle>` — a tiny Card: same halftone-shadow technique,
 * scaled down, pill-shaped. Flips `[data-ctk-theme]` on `<html>` (so the
 * `tokens.css` dark overrides apply site-wide) and remembers the choice
 * in localStorage. Set `target="self"` to instead toggle the attribute
 * on this element's own parent, for isolated demos (e.g. inside Storybook).
 *
 * @fires ctk-theme-change - detail: `{ theme: 'light' | 'dark' }`
 */
@customElement('ctk-theme-toggle')
export class CtkThemeToggle extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    .shadow {
      position: absolute;
      inset: 0;
      transform: translate(5px, 5px);
      background-image: radial-gradient(var(--ctk-dot-color, rgba(26, 23, 37, 0.55)) 1.3px, transparent 1.5px);
      background-size: 6px 6px;
      border-radius: var(--ctk-radius-pill, 999px);
    }
    button {
      all: unset;
      box-sizing: border-box;
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 0.86rem;
      color: var(--ctk-ink, #2b2740);
      background: var(--ctk-bg-soft, #ffffff);
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-pill, 999px);
      padding: 8px 16px;
      cursor: pointer;
    }
  `;

  /** Where to flip the theme attribute: `html` (default, affects the
   * whole page) or `self` (this element's parent, for isolated previews). */
  @property() target: 'html' | 'self' = 'html';

  @state() private _theme: 'light' | 'dark' = 'light';

  connectedCallback() {
    super.connectedCallback();
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage unavailable — fall through to system preference */
    }
    if (saved === 'dark' || saved === 'light') {
      this._theme = saved;
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      this._theme = 'dark';
    }
    this.#apply();
  }

  render() {
    return html`
      <div class="shadow"></div>
      <button @click=${this.#toggle} aria-label="Toggle dark mode">
        <span>${this._theme === 'dark' ? '☀️' : '🌙'}</span>
        <span>${this._theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>
    `;
  }

  #toggle() {
    this._theme = this._theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORAGE_KEY, this._theme);
    } catch {
      /* ignore — theme still applies for this session */
    }
    this.#apply();
    this.dispatchEvent(
      new CustomEvent('ctk-theme-change', { detail: { theme: this._theme }, bubbles: true, composed: true }),
    );
  }

  #apply() {
    const el = this.target === 'self' ? (this.parentElement ?? document.documentElement) : document.documentElement;
    el.setAttribute('data-ctk-theme', this._theme);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-theme-toggle': CtkThemeToggle;
  }
}
