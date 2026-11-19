import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { setPresence } from '../motion.js';

/**
 * `<ctk-hamburger>` — a menu button that opens a left drawer on narrow
 * screens. Put any content in the default slot; links inside the drawer
 * close it when clicked.
 *
 * The button only shows while the viewport is at or below `breakpoint`.
 * Above it, the button is hidden and the drawer is closed.
 *
 * Clicking the backdrop closes the drawer. Escape does not close it.
 *
 * @slot - Drawer content (links, buttons, anything).
 * @fires ctk-toggle - detail: `{ open: boolean }`, whenever `open` changes after the first render.
 */
@customElement('ctk-hamburger')
export class CtkHamburger extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
      color: var(--ctk-ink, #2b2740);
    }
    [hidden] {
      display: none !important;
    }
    .burger {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      cursor: pointer;
      background: var(--ctk-bg-soft, #ffffff);
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-card, 6px);
      box-shadow: 3px 3px 0 var(--ctk-panel-ink, #1a1725);
    }
    .burger:focus-visible {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 2px;
    }
    .icon {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 18px;
    }
    .icon span {
      display: block;
      height: 2.5px;
      background: var(--ctk-panel-ink, #1a1725);
      border-radius: 2px;
      transition: transform var(--ctk-motion-enter, 200ms) ease-out, opacity var(--ctk-motion-enter, 200ms) ease-out;
    }
    .burger[aria-expanded='true'] .icon span:nth-child(1) {
      transform: translateY(6.5px) rotate(45deg);
    }
    .burger[aria-expanded='true'] .icon span:nth-child(2) {
      opacity: 0;
    }
    .burger[aria-expanded='true'] .icon span:nth-child(3) {
      transform: translateY(-6.5px) rotate(-45deg);
    }
    @media (prefers-reduced-motion: reduce) {
      .icon span {
        transition: none;
      }
    }
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(26, 23, 37, 0.55);
    }
    .drawer {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1001;
      box-sizing: border-box;
      width: 280px;
      max-width: 85vw;
      padding: 20px 16px;
      overflow-y: auto;
      background: var(--ctk-bg-soft, #ffffff);
      border-right: 3px solid var(--ctk-panel-ink, #1a1725);
      box-shadow: 6px 0 0 var(--ctk-panel-ink, #1a1725);
    }
  `;

  /** Whether the drawer is open. Reflected to the attribute. */
  @property({ type: Boolean, reflect: true }) open = false;
  /** Accessible name for the button and the drawer. */
  @property() label = 'Menu';
  /** Button shows at or below this width. Any CSS length. */
  @property() breakpoint = '720px';

  @state() private narrow = true;

  #mql?: MediaQueryList;

  connectedCallback() {
    super.connectedCallback();
    this.#bindMedia();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#mql?.removeEventListener('change', this.#onMediaChange);
    this.#mql = undefined;
  }

  #bindMedia() {
    this.#mql?.removeEventListener('change', this.#onMediaChange);
    this.#mql = window.matchMedia(`(max-width: ${this.breakpoint})`);
    this.#mql.addEventListener('change', this.#onMediaChange);
    this.#onMediaChange(this.#mql);
  }

  #onMediaChange = (e: MediaQueryList | MediaQueryListEvent) => {
    this.narrow = e.matches;
    // Above the breakpoint there is no button, so never leave the drawer open.
    if (!e.matches && this.open) this.open = false;
  };

  updated(changed: Map<string, unknown>) {
    // Rebind when the breakpoint changes after the first render.
    if (changed.has('breakpoint') && changed.get('breakpoint') !== undefined) this.#bindMedia();

    const drawer = this.renderRoot.querySelector<HTMLElement>('.drawer');
    const backdrop = this.renderRoot.querySelector<HTMLElement>('.backdrop');
    if (changed.has('open')) {
      setPresence(drawer, this.open, 'slide-left');
      setPresence(backdrop, this.open, 'fade');
      // The first update has no previous value, so skip it.
      if (changed.get('open') !== undefined) {
        this.dispatchEvent(
          new CustomEvent('ctk-toggle', { detail: { open: this.open }, bubbles: true, composed: true }),
        );
      }
    }
  }

  render() {
    return html`
      <button
        class="burger"
        type="button"
        aria-label=${this.label}
        aria-expanded=${this.open ? 'true' : 'false'}
        aria-controls="drawer"
        ?hidden=${!this.narrow}
        @click=${() => (this.open = !this.open)}
      >
        <span class="icon" aria-hidden="true"><span></span><span></span><span></span></span>
      </button>
      <div class="backdrop" hidden @click=${() => (this.open = false)}></div>
      <aside id="drawer" class="drawer" aria-label=${this.label} hidden @click=${this.#onDrawerClick}>
        <slot></slot>
      </aside>
    `;
  }

  #onDrawerClick(e: Event) {
    // Clicking a link inside the drawer navigates, so close it first.
    const target = e.target as Element | null;
    if (target?.closest?.('a[href]')) this.open = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-hamburger': CtkHamburger;
  }
}
