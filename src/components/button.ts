import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ctk-button>` — the "Open app" CTA chip. A pill filled with a solid
 * accent color, outlined in `panel-ink` like every other panel in the
 * system, white uppercase label with a trailing arrow that nudges right
 * on hover.
 *
 * Known contrast gap (ported from the source design system, documented
 * rather than silently fixed): white label text on a bright accent fill
 * can fall under 4.5:1 for small bold text. Darken `accent` a couple of
 * steps, or pass a darker custom `--ctk-accent`, if that matters for your
 * use case.
 *
 * @fires ctk-click - Forwarded from the internal click, with no payload.
 *   Listening to the native `click` event works too; this is provided so
 *   frameworks that prefer custom events have one to bind to.
 *
 * @csspart button - the pill element itself, for structural overrides.
 */
@customElement('ctk-button')
export class CtkButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #ffffff;
      background: var(--accent, var(--ctk-accent, #7c5cff));
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-pill, 999px);
      padding: 7px 14px;
      cursor: pointer;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    svg {
      width: 14px;
      height: 14px;
      transition: transform 0.15s ease;
      flex: none;
    }
    button:hover:not(:disabled) svg {
      transform: translateX(4px);
    }
  `;

  /** Button label. Prefer a short verb phrase ("OPEN APP"); it is
   * upper-cased visually by the component, so pass normal case text. */
  @property() label = 'Open app';

  /** Disables the button and dims it. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Hides the trailing arrow icon, for buttons that aren't a navigation CTA. */
  @property({ type: Boolean, attribute: 'no-arrow' }) noArrow = false;

  render() {
    return html`
      <button part="button" ?disabled=${this.disabled} @click=${this.#onClick}>
        <slot>${this.label}</slot>
        ${this.noArrow
          ? null
          : html`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>`}
      </button>
    `;
  }

  #onClick(e: MouseEvent) {
    if (this.disabled) {
      e.stopPropagation();
      return;
    }
    this.dispatchEvent(new CustomEvent('ctk-click', { bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-button': CtkButton;
  }
}
