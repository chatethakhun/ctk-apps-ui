import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ctk-skeleton>` — a placeholder block shown while content loads.
 * Size it with `width` and `height` (any CSS length). Use `shape="circle"`
 * for avatars and `shape="text"` for a line of text.
 */
@customElement('ctk-skeleton')
export class CtkSkeleton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      max-width: 100%;
    }
    .block {
      display: block;
      width: var(--w, 100%);
      height: var(--h, 16px);
      border: 2px solid var(--ctk-panel-ink-tint, rgba(26, 23, 37, 0.1));
      border-radius: var(--ctk-radius-card, 6px);
      background: linear-gradient(
        90deg,
        var(--ctk-accent-soft, #efe9ff) 25%,
        var(--ctk-bg-soft, #ffffff) 50%,
        var(--ctk-accent-soft, #efe9ff) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.4s ease-in-out infinite;
    }
    :host([shape='circle']) .block {
      border-radius: 50%;
    }
    :host([shape='text']) .block {
      height: 12px;
      border-radius: var(--ctk-radius-pill, 999px);
    }
    @keyframes shimmer {
      from {
        background-position: 100% 0;
      }
      to {
        background-position: -100% 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .block {
        animation: none;
      }
    }
  `;

  @property({ reflect: true }) shape: 'rect' | 'circle' | 'text' = 'rect';
  @property() width = '100%';
  @property() height = '16px';

  render() {
    return html`<span
      class="block"
      role="presentation"
      style="--w: ${this.width}; --h: ${this.height}"
    ></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-skeleton': CtkSkeleton;
  }
}
