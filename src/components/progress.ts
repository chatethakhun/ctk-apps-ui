import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ctk-progress>` — a determinate progress bar. Set `value` (and `max`,
 * default 100). Leave `label` empty if the surrounding context already
 * names the task.
 */
@customElement('ctk-progress')
export class CtkProgress extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    .meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--ctk-ink-soft, #5c5675);
    }
    .track {
      height: 18px;
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-pill, 999px);
      background: var(--ctk-bg-soft, #ffffff);
      overflow: hidden;
    }
    .fill {
      height: 100%;
      background: var(--accent, var(--ctk-accent, #7c5cff));
      border-right: 2.5px solid var(--ctk-panel-ink, #1a1725);
      transition: width 0.3s ease;
    }
  `;

  @property({ type: Number }) value = 0;
  @property({ type: Number }) max = 100;
  @property() label = '';

  render() {
    const pct = this.max > 0 ? Math.min(100, Math.max(0, (this.value / this.max) * 100)) : 0;
    const rounded = Math.round(pct);
    return html`
      ${this.label
        ? html`<div class="meta"><span>${this.label}</span><span>${rounded}%</span></div>`
        : null}
      <div
        class="track"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuenow=${this.value}
        aria-label=${this.label || 'Progress'}
      >
        <div class="fill" style="width: ${pct}%"></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-progress': CtkProgress;
  }
}
