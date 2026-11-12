import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ctk-pagination>` — deliberately minimal: a Prev button, the current
 * page (of a total, when known), and a Next button. No page-number list.
 *
 * @fires ctk-page-change - detail: `{ page: number }`
 */
@customElement('ctk-pagination')
export class CtkPagination extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    .paginate {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .paginate-btn {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      font-weight: 700;
      font-size: 0.82rem;
      color: var(--ctk-ink, #2b2740);
      background: var(--ctk-bg-soft, #ffffff);
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-pill, 999px);
      padding: 7px 14px;
    }
    .paginate-btn:hover:not(:disabled) {
      background: var(--ctk-accent-soft, #efe9ff);
    }
    .paginate-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .paginate-btn svg {
      width: 14px;
      height: 14px;
      pointer-events: none;
    }
    .paginate-label {
      font-weight: 700;
      font-size: 0.82rem;
      color: var(--ctk-ink-soft, #5c5675);
      white-space: nowrap;
    }
    .paginate-label strong {
      color: var(--ctk-ink, #2b2740);
    }
  `;

  @property({ type: Number }) page = 1;
  @property({ attribute: 'total-pages', type: Number }) totalPages?: number;

  render() {
    const atStart = this.page <= 1;
    const atEnd = this.totalPages != null && this.page >= this.totalPages;
    return html`
      <div class="paginate">
        <button type="button" class="paginate-btn" ?disabled=${atStart} @click=${() => this.#go(this.page - 1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          Prev
        </button>
        <span class="paginate-label">
          Page <strong>${this.page}</strong>${this.totalPages != null ? html` of <strong>${this.totalPages}</strong>` : null}
        </span>
        <button type="button" class="paginate-btn" ?disabled=${atEnd} @click=${() => this.#go(this.page + 1)}>
          Next
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    `;
  }

  #go(page: number) {
    if (page < 1) return;
    if (this.totalPages != null && page > this.totalPages) return;
    this.page = page;
    this.dispatchEvent(new CustomEvent('ctk-page-change', { detail: { page }, bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-pagination': CtkPagination;
  }
}
