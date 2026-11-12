import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ctk-card>` — a comic-panel card: thick `panel-ink` border, a halftone
 * drop shadow (not a blur), optional tilt, and a hover lift that slides
 * the shadow further out. The whole card becomes a link when `href` is set.
 *
 * Put an illustration in the `illustration` slot, longer body copy in the
 * `body` slot (or use the `body` prop for plain text), and a `<ctk-button>`
 * in the `cta` slot.
 *
 * @slot illustration - Art for the card's stage area (an SVG mascot, icon, etc).
 * @slot body - Rich body content. Overrides the `body` prop when provided.
 * @slot cta - A `<ctk-button>` (or anything) for the card's call to action.
 */
@customElement('ctk-card')
export class CtkCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    .wrap {
      position: relative;
      transition: transform 0.15s ease;
    }
    .shadow {
      position: absolute;
      inset: 0;
      transform: translate(9px, 9px);
      background-image: radial-gradient(var(--ctk-dot-color, rgba(26, 23, 37, 0.55)) 1.5px, transparent 1.7px);
      background-size: 7px 7px;
      border-radius: var(--ctk-radius-card, 6px);
      transition: transform 0.15s ease;
    }
    .wrap:hover .shadow {
      transform: translate(15px, 15px);
    }
    .wrap:hover .card {
      transform: translate(-5px, -7px);
    }
    .card {
      position: relative;
      z-index: 1;
      display: block;
      background: var(--ctk-bg-soft, #ffffff);
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-card, 6px);
      padding: 18px;
      text-decoration: none;
      color: inherit;
      transition: transform 0.15s ease;
    }
    .stage {
      border-radius: var(--ctk-radius-panel, 4px);
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      background: var(--tile, var(--ctk-accent-soft, #efe9ff));
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      margin-bottom: 14px;
    }
    ::slotted([slot='illustration']) {
      width: 100px;
      height: 100px;
    }
    h3 {
      margin: 0 0 6px;
      font-family: var(--ctk-font-display, 'Bangers', sans-serif);
      font-weight: 400;
      font-size: 1.15rem;
      color: var(--ctk-ink, #2b2740);
    }
    p,
    ::slotted([slot='body']) {
      margin: 0 0 12px;
      font-size: 0.88rem;
      line-height: 1.5;
      color: var(--ctk-ink-soft, #5c5675);
    }
    ::slotted([slot='cta']) {
      margin-top: 4px;
    }
  `;

  /** Card title, shown in the display font. */
  @property() cardTitle = '';

  /** Plain-text body copy. Ignored if a `body` slot is provided. */
  @property() body = '';

  /** Navigates here when the card is clicked; renders the card as an `<a>`. */
  @property() href?: string;

  /** Fixed tilt angle in degrees — pass whatever scatter value fits your
   * grid (the source system cycles roughly -1.1deg to 1deg per card). */
  @property({ type: Number }) tilt = 0;

  /** Background tile color behind the illustration stage. */
  @property({ attribute: 'tile-color' }) tileColor?: string;

  render() {
    const style = `
      transform: rotate(${this.tilt}deg);
      ${this.tileColor ? `--tile: ${this.tileColor};` : ''}
    `;
    const inner = html`
      <div class="stage"><slot name="illustration"></slot></div>
      ${this.cardTitle ? html`<h3>${this.cardTitle}</h3>` : nothing}
      <slot name="body">${this.body ? html`<p>${this.body}</p>` : nothing}</slot>
      <slot name="cta"></slot>
    `;
    return html`
      <div class="wrap" style=${style}>
        <div class="shadow"></div>
        ${this.href
          ? html`<a class="card" part="card" href=${this.href}>${inner}</a>`
          : html`<div class="card" part="card">${inner}</div>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-card': CtkCard;
  }
}
