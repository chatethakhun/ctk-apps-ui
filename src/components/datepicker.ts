import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function sameDay(a: Date | null, b: Date | null) {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function fromISO(s?: string | null) {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function fmtShort(d: Date) {
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/**
 * `<ctk-datepicker>` — a text trigger + popup calendar, not a native
 * `<input type="date">`, so it can carry this system's comic-panel look.
 * Supports a single date or a start–end range. The grid itself is kept
 * light on purpose (no border per day); only "today" (a ring) and the
 * selected day/range (a solid `panel-ink` fill) stand out.
 *
 * Picks are a draft until Apply is pressed — Cancel discards them and
 * keeps whatever was previously committed.
 *
 * @fires ctk-change - detail: `{ start: string | null; end: string | null }`
 *   ISO `YYYY-MM-DD` strings, fired when Apply commits a new value.
 */
@customElement('ctk-datepicker')
export class CtkDatepicker extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    label {
      font-weight: 700;
      font-size: 0.76rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--ctk-ink, #2b2740);
    }
    .hint {
      font-size: 0.74rem;
      color: var(--ctk-ink-soft, #5c5675);
    }
    .dp {
      position: relative;
    }
    .trigger {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      cursor: pointer;
      font: inherit;
      font-size: 0.9rem;
      color: var(--ctk-ink, #2b2740);
      background: var(--ctk-bg-soft, #ffffff);
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-panel, 4px);
      padding: 10px 12px;
    }
    .trigger .arrow {
      width: 16px;
      height: 16px;
      margin-left: auto;
      flex: none;
      transition: transform 0.15s ease;
    }
    .trigger[aria-expanded='true'] .arrow {
      transform: rotate(180deg);
    }
    .cal-icon {
      flex: none;
    }
    .current.placeholder {
      color: var(--ctk-ink-soft, #5c5675);
      font-style: italic;
    }
    .panel-shadow {
      position: absolute;
      left: 0;
      right: 0;
      top: calc(100% + 10px);
      height: 0;
    }
    .panel-shadow::before {
      content: '';
      position: absolute;
      inset: 0;
      transform: translate(5px, 5px);
      background-image: radial-gradient(var(--ctk-dot-color, rgba(26, 23, 37, 0.55)) 1.2px, transparent 1.4px);
      background-size: 5px 5px;
      border-radius: 6px;
    }
    .popup {
      position: absolute;
      left: 0;
      top: calc(100% + 10px);
      z-index: 30;
      width: 290px;
      background: var(--ctk-bg-soft, #ffffff);
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: 6px;
      padding: 14px;
    }
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .month-label {
      font-weight: 700;
      font-size: 0.86rem;
      color: var(--ctk-ink, #2b2740);
    }
    .nav {
      all: unset;
      box-sizing: border-box;
      width: 26px;
      height: 26px;
      border: 2px solid var(--ctk-panel-ink, #1a1725);
      border-radius: 4px;
      background: var(--ctk-bg-soft, #ffffff);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .nav:hover {
      background: var(--ctk-accent-soft, #efe9ff);
    }
    .nav svg {
      width: 14px;
      height: 14px;
      pointer-events: none;
    }
    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      font-size: 0.66rem;
      font-weight: 700;
      color: var(--ctk-ink-soft, #5c5675);
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: 32px;
      gap: 2px 0;
    }
    .day {
      all: unset;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.82rem;
      color: var(--ctk-ink, #2b2740);
      cursor: pointer;
    }
    .day-fill {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    .day:hover .day-fill {
      background: var(--ctk-accent-soft, #efe9ff);
    }
    .day.outside {
      color: var(--ctk-ink-soft, #5c5675);
      opacity: 0.45;
    }
    .day.today .day-fill {
      border: 2px solid var(--ctk-panel-ink, #1a1725);
    }
    .day.in-range {
      background: var(--ctk-panel-ink-tint, rgba(26, 23, 37, 0.1));
    }
    .day.range-start {
      border-radius: 999px 0 0 999px;
      background: var(--ctk-panel-ink-tint, rgba(26, 23, 37, 0.1));
    }
    .day.range-end {
      border-radius: 0 999px 999px 0;
      background: var(--ctk-panel-ink-tint, rgba(26, 23, 37, 0.1));
    }
    .day.selected .day-fill {
      background: var(--ctk-panel-ink, #1a1725);
      color: var(--ctk-bg-soft, #ffffff);
      font-weight: 700;
    }
    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-top: 12px;
      padding-top: 10px;
      border-top: 2px solid var(--ctk-panel-ink, #1a1725);
    }
    .mode-note {
      font-size: 0.7rem;
      color: var(--ctk-ink-soft, #5c5675);
    }
    .btn-ghost {
      all: unset;
      cursor: pointer;
      font-weight: 700;
      font-size: 0.76rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--ctk-ink-soft, #5c5675);
      padding: 6px 10px;
    }
    .btn-ghost:hover {
      color: var(--ctk-ink, #2b2740);
    }
    .btn-primary {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      font-weight: 700;
      font-size: 0.76rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      background: var(--ctk-panel-ink, #1a1725);
      color: var(--ctk-bg-soft, #ffffff);
      padding: 7px 16px;
      border-radius: 999px;
      border: 2px solid var(--ctk-panel-ink, #1a1725);
    }
    .btn-primary:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `;

  @property() label = '';
  @property() hint = '';
  @property() mode: 'single' | 'range' = 'single';
  /** Committed value (ISO `YYYY-MM-DD`). In range mode this is the start date. */
  @property({ attribute: 'start-date' }) startDate?: string;
  /** Committed end date (ISO `YYYY-MM-DD`), range mode only. */
  @property({ attribute: 'end-date' }) endDate?: string;

  @state() private _open = false;
  @state() private _draftStart: Date | null = null;
  @state() private _draftEnd: Date | null = null;
  @state() private _viewYear = new Date().getFullYear();
  @state() private _viewMonth = new Date().getMonth();

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.#onDocClick);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.#onDocClick);
    super.disconnectedCallback();
  }

  render() {
    const committedStart = fromISO(this.startDate);
    const committedEnd = fromISO(this.endDate);
    const label =
      this.mode === 'single'
        ? committedStart
          ? fmtShort(committedStart)
          : 'Select a date'
        : committedStart && committedEnd
          ? `${fmtShort(committedStart)} – ${fmtShort(committedEnd)}`
          : 'Select dates';
    const isPlaceholder = this.mode === 'single' ? !committedStart : !(committedStart && committedEnd);

    return html`
      <div class="field">
        ${this.label ? html`<label>${this.label}</label>` : null}
        <div class="dp">
          <button type="button" class="trigger" aria-haspopup="dialog" aria-expanded=${this._open} @click=${this.#toggle}>
            <svg class="cal-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ctk-panel-ink, #1a1725)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="8" y1="3" x2="8" y2="7" />
              <line x1="16" y1="3" x2="16" y2="7" />
            </svg>
            <span class="current ${isPlaceholder ? 'placeholder' : ''}">${label}</span>
            <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="var(--ctk-panel-ink, #1a1725)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div class="panel-shadow" aria-hidden="true"></div>
          ${this._open ? this.#renderPopup() : null}
        </div>
        ${this.hint ? html`<span class="hint">${this.hint}</span>` : null}
      </div>
    `;
  }

  #renderPopup() {
    const cells = this.#buildGrid();
    const canApply = this.mode === 'single' ? !!this._draftStart : !!(this._draftStart && this._draftEnd);
    return html`
      <div class="popup" role="dialog">
        <div class="head">
          <button type="button" class="nav" aria-label="Previous month" @click=${() => this.#changeMonth(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--ctk-panel-ink, #1a1725)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <span class="month-label">${MONTHS[this._viewMonth]} ${this._viewYear}</span>
          <button type="button" class="nav" aria-label="Next month" @click=${() => this.#changeMonth(1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--ctk-panel-ink, #1a1725)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
        <div class="weekdays"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div>
        <div class="grid">
          ${cells.map(
            (c) => html`
              <button
                type="button"
                class="day ${c.classes.join(' ')}"
                @click=${(e: Event) => {
                  e.stopPropagation();
                  this.#pick(c.date);
                }}
              >
                <span class="day-fill">${c.date.getDate()}</span>
              </button>
            `,
          )}
        </div>
        <div class="actions">
          ${this.mode === 'range' ? html`<span class="mode-note">Pick a start, then an end</span>` : html`<span></span>`}
          <span style="display:flex;gap:10px;">
            <button type="button" class="btn-ghost" @click=${this.#cancel}>Cancel</button>
            <button type="button" class="btn-primary" ?disabled=${!canApply} @click=${this.#apply}>Apply</button>
          </span>
        </div>
      </div>
    `;
  }

  #buildGrid() {
    const today = new Date();
    const firstOfMonth = new Date(this._viewYear, this._viewMonth, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(this._viewYear, this._viewMonth, 1 - startOffset);
    const cells: { date: Date; classes: string[] }[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      const classes: string[] = [];
      if (d.getMonth() !== this._viewMonth) classes.push('outside');
      if (sameDay(d, today)) classes.push('today');
      if (this.mode === 'single') {
        if (sameDay(d, this._draftStart)) classes.push('selected');
      } else {
        if (this._draftStart && sameDay(d, this._draftStart)) classes.push('selected', 'range-start');
        if (this._draftEnd && sameDay(d, this._draftEnd)) classes.push('selected', 'range-end');
        if (this._draftStart && this._draftEnd && d > this._draftStart && d < this._draftEnd) classes.push('in-range');
      }
      cells.push({ date: d, classes });
    }
    return cells;
  }

  #toggle(e: Event) {
    e.stopPropagation();
    if (this._open) {
      this.#close();
    } else {
      this._draftStart = fromISO(this.startDate);
      this._draftEnd = fromISO(this.endDate);
      const anchor = this._draftStart ?? new Date();
      this._viewYear = anchor.getFullYear();
      this._viewMonth = anchor.getMonth();
      this._open = true;
    }
  }

  #pick(d: Date) {
    if (this.mode === 'single') {
      this._draftStart = d;
    } else if (!this._draftStart || (this._draftStart && this._draftEnd)) {
      this._draftStart = d;
      this._draftEnd = null;
    } else if (d < this._draftStart) {
      this._draftStart = d;
      this._draftEnd = null;
    } else {
      this._draftEnd = d;
    }
  }

  #changeMonth(delta: number) {
    let m = this._viewMonth + delta;
    let y = this._viewYear;
    if (m < 0) {
      m = 11;
      y--;
    } else if (m > 11) {
      m = 0;
      y++;
    }
    this._viewMonth = m;
    this._viewYear = y;
  }

  #cancel(e: Event) {
    e.stopPropagation();
    this.#close();
  }

  #apply(e: Event) {
    e.stopPropagation();
    if (this.mode === 'single' && !this._draftStart) return;
    if (this.mode === 'range' && !(this._draftStart && this._draftEnd)) return;
    this.startDate = this._draftStart ? toISO(this._draftStart) : undefined;
    this.endDate = this._draftEnd ? toISO(this._draftEnd) : undefined;
    this.dispatchEvent(
      new CustomEvent('ctk-change', {
        detail: { start: this.startDate ?? null, end: this.endDate ?? null },
        bubbles: true,
        composed: true,
      }),
    );
    this.#close();
  }

  #close() {
    this._open = false;
  }

  #onDocClick = (e: Event) => {
    if (this._open && !e.composedPath().includes(this)) {
      this.#close();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-datepicker': CtkDatepicker;
  }
}
