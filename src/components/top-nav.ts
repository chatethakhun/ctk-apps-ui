import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared-styles.js';
import './hamburger.js';

export interface CtkNavLink {
  label: string;
  href?: string;
  active?: boolean;
}

/**
 * `<ctk-top-nav>` — a row of icon-free text links for a header bar, with
 * a thick bottom rule under the active item. Pass `links` or slot your
 * own markup; slotted content renders after the generated links.
 *
 * When the nav is narrower than 560px (measured from its own width, via
 * container queries) the links collapse into a `<ctk-hamburger>` menu.
 * Slotted content only shows in the wide layout, because a slot can only
 * render once.
 *
 * @fires ctk-nav - detail: `{ label: string; href?: string }`, fired when
 *   a generated link is clicked (not fired for slotted content).
 */
@customElement('ctk-top-nav')
export class CtkTopNav extends LitElement {
  static styles = css`
    ${baseStyles}
    :host {
      display: block;
      container-type: inline-size;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    nav {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px 22px;
    }
    .narrow {
      display: none;
    }
    .drawer-links {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 8px 0;
    }
    .drawer-links a {
      padding: 10px 4px;
      font-size: 1rem;
    }
    @container (max-width: 560px) {
      .wide {
        display: none;
      }
      .narrow {
        display: block;
      }
    }
    a {
      position: relative;
      display: inline-block;
      padding: 6px 2px;
      font-weight: 700;
      font-size: 0.86rem;
      text-decoration: none;
      color: var(--ctk-ink-soft, #5c5675);
      cursor: pointer;
    }
    a:hover {
      color: var(--ctk-ink, #2b2740);
    }
    a.active {
      color: var(--ctk-ink, #2b2740);
    }
    a.active::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -4px;
      height: 3px;
      border-radius: 2px;
      background: var(--accent, var(--ctk-accent, #7c5cff));
    }
  `;

  @property({ attribute: false }) links: CtkNavLink[] = [];

  render() {
    return html`
      <nav class="wide">
        ${this.links.map((link) => this.#link(link))}
        <slot></slot>
      </nav>
      <div class="narrow">
        <ctk-hamburger label="Menu">
          <div class="drawer-links">${this.links.map((link) => this.#link(link))}</div>
        </ctk-hamburger>
      </div>
    `;
  }

  #link(link: CtkNavLink) {
    return html`
      <a
        href=${link.href ?? '#'}
        class=${link.active ? 'active' : ''}
        aria-current=${link.active ? 'page' : nothing}
        @click=${(e: Event) => this.#onClick(e, link)}
        >${link.label}</a
      >
    `;
  }

  #onClick(e: Event, link: CtkNavLink) {
    if (!link.href || link.href === '#') e.preventDefault();
    this.dispatchEvent(
      new CustomEvent('ctk-nav', { detail: { label: link.label, href: link.href }, bubbles: true, composed: true }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-top-nav': CtkTopNav;
  }
}
