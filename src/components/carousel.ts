import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

/**
 * `<ctk-carousel>` — a horizontal slide deck. Slides are the element's
 * children; the track scrolls with native scroll-snap, so touch, trackpad and
 * keyboard scrolling all work. Prev/next buttons and dots move between slides.
 *
 * Keyboard: when the carousel has focus, ← and → move one slide.
 *
 * @slot - Slides. Each child element is one slide.
 * @fires ctk-slide - detail: `{ index: number }`, when the visible slide changes
 */
@customElement('ctk-carousel')
export class CtkCarousel extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
      color: var(--ctk-ink, #2b2740);
    }
    .frame {
      position: relative;
      border: 3px solid var(--ctk-panel-ink, #1a1725);
      border-radius: var(--ctk-radius-card, 6px);
      background: var(--ctk-bg-soft, #ffffff);
      box-shadow: 6px 6px 0 var(--ctk-panel-ink, #1a1725);
      overflow: hidden;
    }
    .track {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      overscroll-behavior-x: contain;
    }
    .track::-webkit-scrollbar {
      display: none;
    }
    .track:focus-visible {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: -4px;
    }
    ::slotted(*) {
      flex: 0 0 100%;
      min-width: 0;
      scroll-snap-align: start;
      box-sizing: border-box;
    }
    .nav {
      all: unset;
      box-sizing: border-box;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: 50%;
      background: var(--ctk-bg-soft, #ffffff);
      box-shadow: 2px 2px 0 var(--ctk-panel-ink, #1a1725);
      font-size: 1.2rem;
      font-weight: 700;
      line-height: 1;
      cursor: pointer;
    }
    .nav.prev {
      left: 10px;
    }
    .nav.next {
      right: 10px;
    }
    .nav:hover:not(:disabled) {
      background: var(--ctk-accent-soft, #efe9ff);
    }
    .nav:active:not(:disabled) {
      transform: translate(2px, calc(-50% + 2px));
      box-shadow: none;
    }
    .nav:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .nav:focus-visible {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 2px;
    }
    .dots {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 14px;
    }
    .dot {
      all: unset;
      box-sizing: border-box;
      width: 14px;
      height: 14px;
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: 50%;
      background: var(--ctk-bg-soft, #ffffff);
      cursor: pointer;
    }
    .dot[aria-current='true'] {
      background: var(--accent, var(--ctk-accent, #7c5cff));
    }
    .dot:focus-visible {
      outline: 2px solid var(--ctk-accent, #7c5cff);
      outline-offset: 2px;
    }
    :host([hide-controls]) .nav,
    :host([hide-controls]) .dots {
      display: none;
    }
  `;

  /** Zero-based index of the visible slide. Settable to jump to a slide. */
  @property({ type: Number, reflect: true }) index = 0;
  /** Accessible name for the carousel, for example "Featured products". */
  @property() label = 'Carousel';
  /** Hide the prev/next buttons and dots; swipe or scroll still works. */
  @property({ type: Boolean, attribute: 'hide-controls', reflect: true }) hideControls = false;

  @query('.track') private track!: HTMLElement;
  @state() private count = 0;

  #slides: Element[] = [];

  #readSlides(slot: HTMLSlotElement) {
    this.#slides = slot.assignedElements();
    this.count = this.#slides.length;
    this.index = Math.min(this.index, Math.max(0, this.count - 1));
  }

  #onTrackScroll() {
    const width = this.track.clientWidth;
    if (!width) return;
    const next = Math.round(this.track.scrollLeft / width);
    if (next !== this.index) {
      this.index = next;
      this.dispatchEvent(new CustomEvent('ctk-slide', { detail: { index: next }, bubbles: true, composed: true }));
    }
  }

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('index') && this.track && this.#slides.length) {
      // Only scroll when the index came from outside (dot/arrow/property) and
      // the track is not already there, otherwise scroll handling loops.
      const target = this.track.clientWidth * this.index;
      if (Math.abs(this.track.scrollLeft - target) > 1) {
        this.track.scrollTo({ left: target, behavior: this.#behavior() });
      }
    }
  }

  #behavior(): ScrollBehavior {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  #go(delta: number) {
    const next = Math.min(Math.max(this.index + delta, 0), this.count - 1);
    if (next === this.index) return;
    this.index = next;
    this.dispatchEvent(new CustomEvent('ctk-slide', { detail: { index: next }, bubbles: true, composed: true }));
  }

  #onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.#go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.#go(-1);
    }
  }

  render() {
    const atStart = this.index <= 0;
    const atEnd = this.index >= this.count - 1;
    return html`
      <div class="frame" role="region" aria-roledescription="carousel" aria-label=${this.label}>
        <div
          class="track"
          tabindex="0"
          @scroll=${this.#onTrackScroll}
          @keydown=${this.#onKey}
        >
          <slot @slotchange=${(e: Event) => this.#readSlides(e.target as HTMLSlotElement)}></slot>
        </div>
        ${this.count > 1
          ? html`
              <button class="nav prev" type="button" aria-label="Previous slide" ?disabled=${atStart} @click=${() => this.#go(-1)}>‹</button>
              <button class="nav next" type="button" aria-label="Next slide" ?disabled=${atEnd} @click=${() => this.#go(1)}>›</button>
            `
          : nothing}
      </div>
      ${this.count > 1
        ? html`<div class="dots" role="group" aria-label="Choose slide">
            ${Array.from({ length: this.count }, (_, i) => html`
              <button
                class="dot"
                type="button"
                aria-label=${`Slide ${i + 1}`}
                aria-current=${i === this.index ? 'true' : 'false'}
                @click=${() => this.#goTo(i)}
              ></button>
            `)}
          </div>`
        : nothing}
    `;
  }

  #goTo(i: number) {
    if (i === this.index) return;
    this.index = i;
    this.dispatchEvent(new CustomEvent('ctk-slide', { detail: { index: i }, bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-carousel': CtkCarousel;
  }
}
