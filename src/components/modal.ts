import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

/**
 * `<ctk-modal>` — a dialog panel built on the native `<dialog>`, so focus
 * trapping and Escape handling come from the browser. Set `open` to show
 * it; closing (Escape, backdrop click, or the close button) sets `open`
 * back to false and fires `ctk-close`.
 *
 * @slot - Body content.
 * @slot footer - Optional action buttons shown at the bottom.
 * @fires ctk-close - Fired after the modal closes, no payload.
 */
@customElement('ctk-modal')
export class CtkModal extends LitElement {
  static styles = css`
    :host {
      display: contents;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    dialog {
      border: 3px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-card, 6px);
      background: var(--ctk-bg-soft, #ffffff);
      color: var(--ctk-ink, #2b2740);
      padding: 0;
      width: min(480px, calc(100vw - 32px));
      box-shadow: 6px 6px 0 var(--ctk-panel-ink, #1a1725);
    }
    dialog::backdrop {
      background: rgba(26, 23, 37, 0.55);
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 18px;
      border-bottom: 2.5px solid var(--ctk-panel-ink, #1a1725);
    }
    h2 {
      margin: 0;
      font-family: var(--ctk-font-display, 'Bangers', sans-serif);
      font-size: 1.6rem;
      font-weight: 400;
      letter-spacing: 0.03em;
    }
    .body {
      padding: 18px;
      font-size: 0.92rem;
      line-height: 1.5;
    }
    footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 0 18px 18px;
    }
    .close {
      all: unset;
      cursor: pointer;
      width: 28px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--ctk-panel-ink, #1a1725);
      border-radius: 50%;
      font-weight: 700;
      color: var(--ctk-ink, #2b2740);
    }
    .close:focus-visible {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 2px;
    }
  `;

  @property() heading = '';
  @property({ type: Boolean, reflect: true }) open = false;

  @query('dialog') private dialog!: HTMLDialogElement;

  updated(changed: Map<string, unknown>) {
    if (!changed.has('open') || !this.dialog) return;
    if (this.open && !this.dialog.open) {
      this.dialog.showModal();
    } else if (!this.open && this.dialog.open) {
      this.dialog.close();
    }
  }

  render() {
    return html`
      <dialog
        aria-labelledby="heading"
        @close=${this.#onNativeClose}
        @click=${this.#onBackdropClick}
      >
        <header>
          <h2 id="heading">${this.heading}</h2>
          <button class="close" type="button" aria-label="Close" @click=${this.#close}>×</button>
        </header>
        <div class="body"><slot></slot></div>
        <footer><slot name="footer"></slot></footer>
      </dialog>
    `;
  }

  #close() {
    this.open = false;
  }

  #onNativeClose() {
    // Covers Escape, which the browser closes natively.
    if (this.open) this.open = false;
    this.dispatchEvent(new CustomEvent('ctk-close', { bubbles: true, composed: true }));
  }

  #onBackdropClick(e: MouseEvent) {
    // A click directly on the <dialog> (not its contents) is a backdrop click.
    if (e.target === this.dialog) this.#close();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-modal': CtkModal;
  }
}
