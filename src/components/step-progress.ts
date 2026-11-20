import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ctk-step-progress>` — shows where the user is in a multi-step flow, for
 * example `1 → 2 → 3`. Steps before `current` show a check mark, the current
 * step is highlighted, and later steps are muted.
 *
 * Set `steps` to an array of labels (use the `.steps` property). `current` is
 * zero-based. Pass `current` equal to `steps.length` when every step is done.
 */
@customElement('ctk-step-progress')
export class CtkStepProgress extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
      color: var(--ctk-ink, #2b2740);
    }
    ol {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: flex-start;
    }
    li {
      flex: 1 1 0;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      text-align: center;
    }
    /* Connector from this step's circle to the next one. */
    li:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 17px;
      left: calc(50% + 22px);
      right: calc(-50% + 22px);
      height: 4px;
      border-radius: var(--ctk-radius-pill, 999px);
      background: var(--ctk-bg-soft, #ffffff);
      box-shadow: inset 0 0 0 2px var(--ctk-panel-ink, #1a1725);
    }
    li[data-state='done']:not(:last-child)::after {
      background: var(--accent, var(--ctk-accent, #7c5cff));
    }
    .dot {
      box-sizing: border-box;
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: 50%;
      background: var(--ctk-bg-soft, #ffffff);
      font-family: var(--ctk-font-display, 'Bangers', sans-serif);
      font-size: 1.2rem;
      letter-spacing: 0.03em;
      position: relative;
      z-index: 1;
    }
    li[data-state='done'] .dot {
      background: var(--accent, var(--ctk-accent, #7c5cff));
      color: #ffffff;
    }
    li[data-state='current'] .dot {
      background: #ffffff;
      box-shadow: 3px 3px 0 var(--ctk-panel-ink, #1a1725);
      transform: translateY(-2px);
    }
    li[data-state='upcoming'] .dot {
      opacity: 0.5;
    }
    .label {
      margin-top: 8px;
      font-size: 0.82rem;
      font-weight: 700;
      line-height: 1.3;
      overflow-wrap: anywhere;
    }
    li[data-state='upcoming'] .label {
      color: var(--ctk-ink-soft, #5c5675);
      font-weight: 500;
    }
    .sr {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
    @media (prefers-reduced-motion: no-preference) {
      .dot {
        transition: transform var(--ctk-motion-enter, 200ms) var(--ctk-motion-ease-pop, cubic-bezier(0.34, 1.56, 0.64, 1)),
          background var(--ctk-motion-enter, 200ms) ease;
      }
    }
  `;

  /** Step labels, in order. Set with the `.steps` property. */
  @property({ attribute: false }) steps: string[] = [];
  /** Zero-based index of the current step. */
  @property({ type: Number }) current = 0;

  render() {
    return html`
      <ol aria-label="Progress">
        ${this.steps.map((label, i) => {
          const state = i < this.current ? 'done' : i === this.current ? 'current' : 'upcoming';
          return html`
            <li data-state=${state} aria-current=${state === 'current' ? 'step' : nothing}>
              <span class="dot" aria-hidden="true">${state === 'done' ? '✓' : i + 1}</span>
              <span class="label">${label}</span>
              <span class="sr">${state === 'done' ? 'Completed: ' : state === 'current' ? 'Current: ' : ''}</span>
            </li>
          `;
        })}
      </ol>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-step-progress': CtkStepProgress;
  }
}
