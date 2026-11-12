import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface CtkBreadcrumbItem {
  label: string;
  href?: string;
  /** Marks the current page. The last item is used when none is set. */
  current?: boolean;
}

/**
 * `<ctk-breadcrumb>` — a trail of links showing where the user is. Set
 * `items` from JS: `crumb.items = [{ label: 'Home', href: '/' }, ...]`.
 * The current page is rendered without a link and gets `aria-current`.
 */
@customElement('ctk-breadcrumb')
export class CtkBreadcrumb extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
      font-size: 0.85rem;
    }
    ol {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    li + li::before {
      content: '›';
      font-weight: 700;
      color: var(--ctk-ink-soft, #5c5675);
    }
    a {
      color: var(--ctk-accent, #7c5cff);
      font-weight: 600;
      text-decoration: none;
      border-bottom: 2px solid transparent;
    }
    a:hover {
      border-bottom-color: currentColor;
    }
    a:focus-visible {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 2px;
    }
    .current {
      color: var(--ctk-ink, #2b2740);
      font-weight: 700;
    }
  `;

  @property({ attribute: false }) items: CtkBreadcrumbItem[] = [];
  @property() label = 'Breadcrumb';

  render() {
    const currentIndex = this.items.findIndex((item) => item.current);
    const last = currentIndex >= 0 ? currentIndex : this.items.length - 1;

    return html`
      <nav aria-label=${this.label}>
        <ol>
          ${this.items.map((item, i) => {
            const isCurrent = i === last;
            return html`<li>
              ${isCurrent || !item.href
                ? html`<span class=${isCurrent ? 'current' : ''} aria-current=${isCurrent ? 'page' : nothing}
                    >${item.label}</span
                  >`
                : html`<a href=${item.href}>${item.label}</a>`}
            </li>`;
          })}
        </ol>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-breadcrumb': CtkBreadcrumb;
  }
}
