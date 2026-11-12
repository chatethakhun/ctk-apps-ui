import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * `<ctk-avatar>` — a round profile image. Shows `initials` when there is
 * no `src`, or when the image fails to load.
 */
@customElement('ctk-avatar')
export class CtkAvatar extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      --size: 40px;
      font-family: var(--ctk-font-body, 'Poppins', sans-serif);
    }
    :host([size='sm']) {
      --size: 28px;
    }
    :host([size='lg']) {
      --size: 56px;
    }
    .avatar {
      width: var(--size);
      height: var(--size);
      box-sizing: border-box;
      border: 2.5px solid var(--ctk-panel-ink, #1a1725);
      border-radius: 50%;
      background: var(--ctk-accent-soft, #efe9ff);
      color: var(--ctk-ink, #2b2740);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      font-weight: 700;
      font-size: calc(var(--size) * 0.38);
      letter-spacing: 0.02em;
      user-select: none;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `;

  @property() src = '';
  @property() alt = '';
  @property() initials = '';
  /** `sm` | `md` | `lg` */
  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  @state() private failed = false;

  updated(changed: Map<string, unknown>) {
    if (changed.has('src')) this.failed = false;
  }

  render() {
    const showImage = this.src && !this.failed;
    return html`
      <span class="avatar" role="img" aria-label=${this.alt || this.initials || 'Avatar'}>
        ${showImage
          ? html`<img src=${this.src} alt="" @error=${() => (this.failed = true)} />`
          : this.initials || nothing}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctk-avatar': CtkAvatar;
  }
}
