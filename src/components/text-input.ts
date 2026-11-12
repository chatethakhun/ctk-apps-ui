import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

const fieldStyles = css`
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
  .error {
    font-size: 0.74rem;
    color: var(--ctk-danger, #ff5a7a);
    font-weight: 600;
  }
  .input-wrap {
    position: relative;
  }
  .input-wrap::before {
    content: '';
    position: absolute;
    inset: 0;
    transform: translate(4px, 4px);
    background-image: radial-gradient(var(--ctk-dot-color, rgba(26, 23, 37, 0.55)) 1.2px, transparent 1.4px);
    background-size: 5px 5px;
    border-radius: var(--ctk-radius-panel, 4px);
    transition: transform 0.15s ease;
  }
  .input-wrap:focus-within::before {
    transform: translate(6px, 6px);
  }
  input,
  textarea {
    position: relative;
    z-index: 1;
    width: 100%;
    box-sizing: border-box;
    font-family: inherit;
    font-size: 0.9rem;
    color: var(--ctk-ink, #2b2740);
    background: var(--ctk-bg-soft, #ffffff);
    border: 2.5px solid var(--ctk-panel-ink, #1a1725);
    border-radius: var(--ctk-radius-panel, 4px);
    padding: 10px 12px;
    outline: none;
    transition:
      transform 0.15s ease,
      border-width 0.1s ease;
  }
  input:focus,
  textarea:focus {
    transform: translate(-2px, -2px);
    border-width: 3px;
  }
  input::placeholder,
  textarea::placeholder {
    color: var(--ctk-ink-soft, #5c5675);
    font-style: italic;
    opacity: 1;
  }
  input:disabled,
  textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  input.has-error,
  textarea.has-error {
    border-color: var(--ctk-danger, #ff5a7a);
  }
`;

/**
 * `<ctk-text-input>` — a text field styled as a small panel: `panel-ink`
 * border, halftone shadow, lift on focus instead of a glow ring.
 *
 * @fires ctk-input - detail: `{ value: string }`, on every keystroke.
 * @fires ctk-change - detail: `{ value: string }`, on blur/commit.
 */
@customElement('ctk-text-input')
export class CtkTextInput extends LitElement {
  static styles = fieldStyles;

  @property() label = '';
  @property() value = '';
  @property() placeholder = '';
  @property() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @property() hint = '';
  @property() error = '';
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('input') private _input!: HTMLInputElement;

  render() {
    const id = 'input';
    return html`
      <div class="field">
        ${this.label ? html`<label for=${id}>${this.label}</label>` : null}
        <div class="input-wrap">
          <input
            id=${id}
            class=${this.error ? 'has-error' : ''}
            .value=${this.value}
            type=${this.type}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            @input=${this.#onInput}
            @change=${this.#onChange}
          />
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
    this.value = this._input.value;
    this.dispatchEvent(new CustomEvent('ctk-input', { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  #onChange() {
    this.dispatchEvent(new CustomEvent('ctk-change', { detail: { value: this.value }, bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-text-input': CtkTextInput;
  }
}

export { fieldStyles };
