import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { fieldStyles } from './text-input.js';

/**
 * `<ctk-textarea>` — same panel styling as `<ctk-text-input>`, resizable
 * vertically.
 *
 * @fires ctk-input - detail: `{ value: string }`
 * @fires ctk-change - detail: `{ value: string }`
 */
@customElement('ctk-textarea')
export class CtkTextarea extends LitElement {
  static styles = [
    fieldStyles,
    css`
      textarea {
        resize: vertical;
        min-height: 72px;
      }
    `,
  ];

  @property() label = '';
  @property() value = '';
  @property() placeholder = '';
  @property() hint = '';
  @property() error = '';
  @property({ type: Number }) rows = 3;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('textarea') private _textarea!: HTMLTextAreaElement;

  render() {
    const id = 'textarea';
    return html`
      <div class="field">
        ${this.label ? html`<label for=${id}>${this.label}</label>` : null}
        <div class="input-wrap">
          <textarea
            id=${id}
            class=${this.error ? 'has-error' : ''}
            .value=${this.value}
            placeholder=${this.placeholder}
            rows=${this.rows}
            ?disabled=${this.disabled}
            @input=${this.#onInput}
            @change=${this.#onChange}
          ></textarea>
        </div>
        ${this.error
          ? html`<span class="error">${this.error}</span>`
          : this.hint
            ? html`<span class="hint">${this.hint}</span>`
            : null}
      </div>
    `;
  }

  #onInput() {
    this.value = this._textarea.value;
    this.dispatchEvent(new CustomEvent('ctk-input', { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  #onChange() {
    this.dispatchEvent(new CustomEvent('ctk-change', { detail: { value: this.value }, bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-textarea': CtkTextarea;
  }
}
