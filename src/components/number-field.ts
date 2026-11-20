import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { clamp, snapToStep } from '../number-utils.js';

/**
 * `<ctk-number-field>` — a labelled numeric text input with optional `−` /
 * `+` buttons. Typing is allowed freely; the value is clamped to `min` and
 * `max` and snapped to `step` when the field loses focus or Enter is pressed.
 * Set `value` to `null` (or clear the field) for "no value".
 *
 * @fires ctk-input - detail: `{ value: number | null }`, on every keystroke that parses
 * @fires ctk-change - detail: `{ value: number | null }`, when the committed value changes
 */
@customElement('ctk-number-field')
export class CtkNumberField extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
      color: var(--ctk-ink, #2b2740);
    }
    label {
      display: block;
      margin-bottom: 6px;
      font-size: 0.82rem;
      font-weight: 700;
    }
    .row {
      display: inline-flex;
      align-items: stretch;
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-pill, 999px);
      background: var(--ctk-bg-soft, #ffffff);
      overflow: hidden;
    }
    .row:focus-within {
      box-shadow: 0 0 0 3px var(--ctk-accent-soft, #efe9ff);
      border-color: var(--ctk-accent, #7c5cff);
    }
    input {
      box-sizing: border-box;
      width: 100px;
      padding: 8px 12px;
      border: 0;
      outline: none;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 0.95rem;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }
    input::placeholder {
      color: var(--ctk-ink-soft, #5c5675);
    }
    button {
      all: unset;
      box-sizing: border-box;
      width: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: 700;
      border-right: 2.5px solid var(--ctk-panel-ink, #1a1725);
    }
    button:last-child {
      border-right: 0;
      border-left: 2.5px solid var(--ctk-panel-ink, #1a1725);
    }
    button:hover:not(:disabled) {
      background: var(--ctk-accent-soft, #efe9ff);
    }
    button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    button:focus-visible {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: -4px;
    }
    .hint {
      display: block;
      margin-top: 6px;
      font-size: 0.78rem;
      color: var(--ctk-ink-soft, #5c5675);
    }
    :host([disabled]) .row {
      opacity: 0.5;
    }
  `;

  @property({ type: Number }) value: number | null = null;
  @property({ type: Number }) min?: number;
  @property({ type: Number }) max?: number;
  @property({ type: Number }) step = 1;
  @property() label = '';
  @property() placeholder = '';
  @property() hint = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Hide the `−` / `+` buttons; the field becomes a plain numeric input. */
  @property({ type: Boolean, attribute: 'hide-stepper' }) hideStepper = false;

  @state() private text = '';

  #emitted: number | null | undefined = undefined;

  willUpdate(changed: Map<string, unknown>) {
    // Sync the text from outside changes only; while the user is typing,
    // `value` already matches the text.
    if (changed.has('value') && this.value !== this.#emitted) {
      this.text = this.value == null ? '' : String(this.value);
    }
  }

  render() {
    const v = this.value;
    const atMin = v != null && this.min != null && v <= this.min;
    const atMax = v != null && this.max != null && v >= this.max;
    return html`
      ${this.label ? html`<label for="input">${this.label}</label>` : nothing}
      <div class="row">
        ${this.hideStepper
          ? nothing
          : html`<button type="button" aria-label="Decrease" ?disabled=${this.disabled || atMin} @click=${() => this.#nudge(-1)}>−</button>`}
        <input
          id="input"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          .value=${this.text}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          aria-describedby=${this.hint ? 'hint' : nothing}
          @input=${this.#onInput}
          @change=${this.#commit}
          @keydown=${this.#onKey}
        />
        ${this.hideStepper
          ? nothing
          : html`<button type="button" aria-label="Increase" ?disabled=${this.disabled || atMax} @click=${() => this.#nudge(1)}>+</button>`}
      </div>
      ${this.hint ? html`<span class="hint" id="hint">${this.hint}</span>` : nothing}
    `;
  }

  #onInput(e: Event) {
    this.text = (e.target as HTMLInputElement).value;
    const parsed = this.text.trim() === '' ? null : Number(this.text);
    if (parsed === null || Number.isFinite(parsed)) {
      this.#set(parsed, 'ctk-input');
    }
  }

  #onKey(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.#commit();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.#nudge(e.key === 'ArrowUp' ? 1 : -1);
    }
  }

  #nudge(direction: 1 | -1) {
    if (this.disabled) return;
    const base = this.value ?? this.min ?? 0;
    this.#set(this.#clampValue(base + direction * this.step), 'ctk-change');
    this.text = this.value == null ? '' : String(this.value);
  }

  #commit() {
    if (this.disabled) return;
    const trimmed = this.text.trim();
    const parsed = trimmed === '' ? null : Number(trimmed);
    const next = parsed === null || !Number.isFinite(parsed) ? this.value : this.#clampValue(parsed);
    this.#set(next, 'ctk-change');
    this.text = next == null ? '' : String(next);
  }

  #clampValue(n: number): number {
    const snapped = snapToStep(n, this.min ?? 0, this.step);
    return clamp(snapped, this.min ?? -Infinity, this.max ?? Infinity);
  }

  #set(next: number | null, eventName: 'ctk-input' | 'ctk-change') {
    const changed = next !== this.value;
    this.#emitted = next;
    this.value = next;
    if (eventName === 'ctk-input' || changed) {
      this.dispatchEvent(new CustomEvent(eventName, { detail: { value: next }, bubbles: true, composed: true }));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-number-field': CtkNumberField;
  }
}
