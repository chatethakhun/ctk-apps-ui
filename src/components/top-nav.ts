import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

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
 * @fires ctk-nav - detail: `{ label: string; href?: string }`, fired when
 *   a generated link is clicked (not fired for slotted content).
 */
@customElement('ctk-top-nav')
export class CtkTopNav extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    nav {
      display: flex;
      align-items: center;
      gap: 22px;
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
      <nav>
        ${this.links.map(
          (link) => html`
            <a
              href=${link.href ?? '#'}
              class=${link.active ? 'active' : ''}
              aria-current=${link.active ? 'page' : nothing}
              @click=${(e: Event) => this.#onClick(e, link)}
              >${link.label}</a
            >
          `,
        )}
        <slot></slot>
      </nav>
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
