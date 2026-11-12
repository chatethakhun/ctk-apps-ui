import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface CtkTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

type SortDirection = 'asc' | 'desc';

/**
 * `<ctk-table>` — a data table driven by `columns` and `rows` properties.
 * Click a sortable header to sort; set `selectable` to add a checkbox
 * column.
 *
 * Set the properties from JS: `table.columns = [...]; table.rows = [...]`.
 *
 * @fires ctk-sort - detail: `{ key: string, direction: 'asc' | 'desc' }`
 * @fires ctk-selection-change - detail: `{ indices: number[] }` (indices into the original `rows`)
 */
@customElement('ctk-table')
export class CtkTable extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
      color: var(--ctk-ink, #2b2740);
    }
    .wrap {
      overflow-x: auto;
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-card, 6px);
      background: var(--ctk-bg-soft, #ffffff);
      box-shadow: 4px 4px 0 var(--ctk-panel-ink, #1a1725);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
    }
    th,
    td {
      padding: 10px 14px;
      text-align: left;
      border-bottom: 1.5px solid var(--ctk-panel-ink-tint, rgba(26, 23, 37, 0.1));
      white-space: nowrap;
    }
    thead th {
      font-family: var(--ctk-font-display, 'Bangers', sans-serif);
      font-size: 1.1rem;
      font-weight: 400;
      letter-spacing: 0.03em;
      background: var(--ctk-accent-soft, #efe9ff);
      border-bottom: 2.5px solid var(--ctk-panel-ink, #1a1725);
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    tbody tr:hover {
      background: var(--ctk-accent-soft, #efe9ff);
    }
    .sort {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .sort:focus-visible {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 2px;
    }
    .arrow {
      font-size: 0.7rem;
      color: var(--ctk-ink-soft, #5c5675);
    }
    input[type='checkbox'] {
      width: 16px;
      height: 16px;
      accent-color: var(--ctk-accent, #7c5cff);
      cursor: pointer;
    }
  `;

  @property({ attribute: false }) columns: CtkTableColumn[] = [];
  @property({ attribute: false }) rows: Record<string, unknown>[] = [];
  @property({ type: Boolean }) selectable = false;

  @state() private sortKey?: string;
  @state() private sortDirection: SortDirection = 'asc';
  @state() private selected = new Set<number>();

  #sortedIndices(): number[] {
    const indices = this.rows.map((_, i) => i);
    if (!this.sortKey) return indices;
    const key = this.sortKey;
    const dir = this.sortDirection === 'asc' ? 1 : -1;
    return indices.sort((a, b) => {
      const av = this.rows[a][key];
      const bv = this.rows[b][key];
      if (av == null) return 1;
      if (bv == null) return -1;
      return (av > bv ? 1 : av < bv ? -1 : 0) * dir;
    });
  }

  #toggleSort(col: CtkTableColumn) {
    if (this.sortKey === col.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = col.key;
      this.sortDirection = 'asc';
    }
    this.dispatchEvent(
      new CustomEvent('ctk-sort', {
        detail: { key: this.sortKey, direction: this.sortDirection },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #toggleRow(index: number, checked: boolean) {
    const next = new Set(this.selected);
    if (checked) next.add(index);
    else next.delete(index);
    this.selected = next;
    this.#emitSelection();
  }

  #toggleAll(checked: boolean) {
    this.selected = checked ? new Set(this.rows.map((_, i) => i)) : new Set();
    this.#emitSelection();
  }

  #emitSelection() {
    this.dispatchEvent(
      new CustomEvent('ctk-selection-change', {
        detail: { indices: [...this.selected].sort((a, b) => a - b) },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    const indices = this.#sortedIndices();
    const allSelected = this.rows.length > 0 && this.selected.size === this.rows.length;
    const someSelected = this.selected.size > 0 && !allSelected;

    return html`
      <div class="wrap">
        <table>
          <thead>
            <tr>
              ${this.selectable
                ? html`<th>
                    <input
                      type="checkbox"
                      aria-label="Select all rows"
                      .checked=${allSelected}
                      .indeterminate=${someSelected}
                      @change=${(e: Event) => this.#toggleAll((e.target as HTMLInputElement).checked)}
                    />
                  </th>`
                : nothing}
              ${this.columns.map((col) => {
                const isSorted = this.sortKey === col.key;
                const ariaSort = isSorted ? (this.sortDirection === 'asc' ? 'ascending' : 'descending') : 'none';
                return html`
                  <th aria-sort=${col.sortable ? ariaSort : nothing}>
                    ${col.sortable
                      ? html`<button class="sort" type="button" @click=${() => this.#toggleSort(col)}>
                          ${col.label}
                          <span class="arrow" aria-hidden="true">${isSorted ? (this.sortDirection === 'asc' ? '▲' : '▼') : '↕'}</span>
                        </button>`
                      : col.label}
                  </th>
                `;
              })}
            </tr>
          </thead>
          <tbody>
            ${indices.map(
              (rowIndex) => html`
                <tr>
                  ${this.selectable
                    ? html`<td>
                        <input
                          type="checkbox"
                          aria-label="Select row ${rowIndex + 1}"
                          .checked=${this.selected.has(rowIndex)}
                          @change=${(e: Event) => this.#toggleRow(rowIndex, (e.target as HTMLInputElement).checked)}
                        />
                      </td>`
                    : nothing}
                  ${this.columns.map((col) => html`<td>${String(this.rows[rowIndex][col.key] ?? '')}</td>`)}
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-table': CtkTable;
  }
}
