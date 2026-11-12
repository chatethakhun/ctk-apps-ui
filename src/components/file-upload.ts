import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

/**
 * `<ctk-file-upload>` — a dropzone that accepts files by drag-and-drop or
 * the file picker. Set `accept` (e.g. `image/*`) and `multiple`.
 *
 * Keyboard: the dropzone is a button, so Enter/Space opens the picker.
 *
 * @fires ctk-files - detail: `{ files: File[] }`, when files are chosen or dropped
 */
@customElement('ctk-file-upload')
export class CtkFileUpload extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    .drop {
      all: unset;
      box-sizing: border-box;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 28px 20px;
      text-align: center;
      cursor: pointer;
      color: var(--ctk-ink, #2b2740);
      background: var(--ctk-bg-soft, #ffffff);
      border: 2.5px dashed var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-card, 6px);
      transition: background 0.12s ease;
    }
    .drop:hover,
    .drop.dragging {
      background: var(--ctk-accent-soft, #efe9ff);
    }
    .drop:focus-visible {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 2px;
    }
    .title {
      font-weight: 700;
      font-size: 0.95rem;
    }
    .hint {
      font-size: 0.8rem;
      color: var(--ctk-ink-soft, #5c5675);
    }
    .icon {
      width: 32px;
      height: 32px;
      color: var(--ctk-accent, #7c5cff);
    }
    input {
      display: none;
    }
    ul {
      list-style: none;
      margin: 10px 0 0;
      padding: 0;
      font-size: 0.85rem;
    }
    li {
      padding: 4px 0;
      color: var(--ctk-ink, #2b2740);
    }
  `;

  @property() accept = '';
  @property({ type: Boolean }) multiple = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() label = 'Drop files here or click to browse';

  @query('input') private input!: HTMLInputElement;
  @state() private dragging = false;
  @state() private names: string[] = [];

  render() {
    return html`
      <button
        class="drop ${this.dragging ? 'dragging' : ''}"
        type="button"
        ?disabled=${this.disabled}
        @click=${() => this.input.click()}
        @dragover=${this.#onDragOver}
        @dragleave=${() => (this.dragging = false)}
        @drop=${this.#onDrop}
      >
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" />
        </svg>
        <span class="title">${this.label}</span>
        <span class="hint">${this.accept ? `Accepted: ${this.accept}` : 'Any file type'}</span>
      </button>
      <input
        type="file"
        accept=${this.accept || nothing}
        ?multiple=${this.multiple}
        @change=${(e: Event) => this.#take((e.target as HTMLInputElement).files)}
      />
      ${this.names.length
        ? html`<ul aria-live="polite">${this.names.map((n) => html`<li>${n}</li>`)}</ul>`
        : nothing}
    `;
  }

  #onDragOver(e: DragEvent) {
    e.preventDefault();
    this.dragging = true;
  }

  #onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragging = false;
    this.#take(e.dataTransfer?.files ?? null);
  }

  #take(list: FileList | null) {
    if (!list || list.length === 0 || this.disabled) return;
    const files = this.multiple ? Array.from(list) : [list[0]];
    this.names = files.map((f) => f.name);
    this.dispatchEvent(new CustomEvent('ctk-files', { detail: { files }, bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-file-upload': CtkFileUpload;
  }
}
