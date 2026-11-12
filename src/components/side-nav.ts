import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface CtkSideNavItem {
  label: string;
  href?: string;
  /** Any valid CSS `background` value, shown as a small icon swatch. */
  icon?: string;
  active?: boolean;
}

/**
 * `<ctk-side-nav>` — a vertical icon + label list with an active-state
 * fill, and an optional collapse button that shrinks it to icons-only.
 *
 * @fires ctk-nav - detail: `{ label: string; href?: string }`
 * @fires ctk-collapse-change - detail: `{ collapsed: boolean }`
 */
@customElement('ctk-side-nav')
export class CtkSideNav extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
      width: 220px;
      transition: width 0.15s ease;
    }
    :host([collapsed]) {
      width: 64px;
    }
    .panel {
      display: flex;
      flex-direction: column;
      gap: 2px;
      background: var(--ctk-bg-soft, #ffffff);
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-panel, 4px);
      padding: 8px;
    }
    a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 10px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.86rem;
      color: var(--ctk-ink, #2b2740);
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
    }
    a:hover {
      background: var(--ctk-accent-soft, #efe9ff);
    }
    a.active {
      background: var(--ctk-panel-ink, #1a1725);
      color: var(--ctk-bg-soft, #ffffff);
    }
    .icon {
      width: 20px;
      height: 20px;
      border-radius: 5px;
      flex: none;
      background-size: cover;
      background-position: center;
      background-color: var(--ctk-panel-ink-tint, rgba(26, 23, 37, 0.1));
    }
    a.active .icon {
      background-color: rgba(255, 255, 255, 0.25);
    }
    .label {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    :host([collapsed]) .label {
      display: none;
    }
    .collapse-btn {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 6px;
      padding: 8px 10px;
      border-top: 2px solid var(--ctk-panel-ink-tint, rgba(26, 23, 37, 0.1));
      cursor: pointer;
      font-size: 0.76rem;
      font-weight: 700;
      color: var(--ctk-ink-soft, #5c5675);
    }
    .collapse-btn:hover {
      color: var(--ctk-ink, #2b2740);
    }
    .collapse-btn svg {
      width: 14px;
      height: 14px;
      transition: transform 0.15s ease;
    }
    :host([collapsed]) .collapse-btn svg {
      transform: rotate(180deg);
    }
  `;

  @property({ attribute: false }) items: CtkSideNavItem[] = [];
  @property({ type: Boolean, reflect: true }) collapsed = false;
  @property({ attribute: 'collapsible', type: Boolean }) collapsible = true;

  render() {
    return html`
      <div class="panel">
        ${this.items.map(
          (item) => html`
            <a
              href=${item.href ?? '#'}
              class=${item.active ? 'active' : ''}
              aria-current=${item.active ? 'page' : nothing}
              title=${this.collapsed ? item.label : nothing}
              @click=${(e: Event) => this.#onClick(e, item)}
            >
              <span class="icon" style=${item.icon ? `background:${item.icon}` : nothing}></span>
              <span class="label">${item.label}</span>
            </a>
          `,
        )}
        ${this.collapsible
          ? html`
              <button type="button" class="collapse-btn" @click=${this.#toggleCollapse}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
                <span class="label">Collapse</span>
              </button>
            `
          : null}
      </div>
    `;
  }

  #onClick(e: Event, item: CtkSideNavItem) {
    if (!item.href || item.href === '#') e.preventDefault();
    this.dispatchEvent(
      new CustomEvent('ctk-nav', { detail: { label: item.label, href: item.href }, bubbles: true, composed: true }),
    );
  }

  #toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.dispatchEvent(
      new CustomEvent('ctk-collapse-change', { detail: { collapsed: this.collapsed }, bubbles: true, composed: true }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-side-nav': CtkSideNav;
  }
}
