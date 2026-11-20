import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { lockScroll, unlockScroll } from '../scroll-lock.js';
import { baseStyles } from '../shared-styles.js';

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
    ${baseStyles}
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
      max-width: calc(100vw - 32px);
      max-height: calc(100dvh - 32px);
      overflow-y: auto;
      box-shadow: 6px 6px 0 var(--ctk-panel-ink, #1a1725);
    }
    dialog::backdrop {
      background: rgba(26, 23, 37, 0.55);
    }
    /* The native <dialog> is removed from the top layer on close(), so the
       exit runs first (class .closing) and close() is called when it ends. */
    dialog[open] {
      animation: ctk-modal-in var(--ctk-motion-enter, 200ms) var(--ctk-motion-ease-pop, cubic-bezier(0.34, 1.56, 0.64, 1));
    }
    dialog[open]::backdrop {
      animation: ctk-fade-in var(--ctk-motion-enter, 200ms) ease-out;
    }
    dialog.closing {
      animation: ctk-modal-out var(--ctk-motion-exit, 140ms) var(--ctk-motion-ease-exit, ease-in) forwards;
    }
    dialog.closing::backdrop {
      animation: ctk-fade-out var(--ctk-motion-exit, 140ms) ease-in forwards;
    }
    @keyframes ctk-modal-in {
      from { opacity: 0; transform: scale(0.92); }
      70% { opacity: 1; transform: scale(1.03); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes ctk-modal-out {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.94); }
    }
    @keyframes ctk-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes ctk-fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      dialog[open] {
        animation-name: ctk-fade-in;
      }
      dialog.closing {
        animation-name: ctk-fade-out;
      }
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
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 10px;
      padding: 0 18px 18px;
    }
    slot[name='footer']::slotted(*) {
      max-width: 100%;
    }
    @media (max-width: 380px) {
      footer {
        justify-content: stretch;
      }
      slot[name='footer']::slotted(*) {
        flex: 1 1 100%;
      }
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
      this.dialog.classList.remove('closing');
      this.dialog.showModal();
      this.#setScrollLock(true);
    } else if (!this.open && this.dialog.open) {
      this.#animateClose();
    }
  }

  render() {
    return html`
      <dialog
        aria-labelledby="heading"
        @close=${this.#onNativeClose}
        @cancel=${this.#onCancel}
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
    if (this.open) this.open = false;
    this.dispatchEvent(new CustomEvent('ctk-close', { bubbles: true, composed: true }));
  }

  #onCancel(e: Event) {
    // Escape would close the dialog at once. Stop that so the exit animation
    // plays, and let `open = false` drive the actual close.
    e.preventDefault();
    this.#close();
  }

  #scrollLocked = false;

  #setScrollLock(on: boolean) {
    if (on === this.#scrollLocked) return;
    this.#scrollLocked = on;
    if (on) lockScroll();
    else unlockScroll();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // A modal removed while open must still release the page.
    this.#setScrollLock(false);
  }

  #animateClose() {
    const dialog = this.dialog;
    let done = false;
    const onEnd = (e: Event) => {
      // Children can run their own animations, so only the dialog's counts.
      if (e.target === dialog) finish();
    };
    const finish = () => {
      if (done) return;
      done = true;
      dialog.removeEventListener('animationend', onEnd);
      dialog.classList.remove('closing');
      dialog.close();
      this.#setScrollLock(false);
    };
    dialog.classList.add('closing');
    dialog.addEventListener('animationend', onEnd);
    // Fallback in case animationend never fires (e.g. the element is hidden).
    window.setTimeout(finish, 300);
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
