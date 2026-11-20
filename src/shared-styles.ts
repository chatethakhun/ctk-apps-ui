import { css } from 'lit';

/**
 * Base rules every `ctk-*` component includes at the top of its styles.
 *
 * - Long words, URLs and unbroken strings wrap instead of pushing the layout
 *   wider than its container. `overflow-wrap` is inherited, so this also
 *   covers slotted light-DOM content.
 * - `text-wrap: pretty` avoids one-word last lines in paragraphs.
 * - The host can shrink below its content width, so it fits narrow parents.
 */
export const baseStyles = css`
  :host {
    max-width: 100%;
    min-width: 0;
    overflow-wrap: anywhere;
    text-wrap: pretty;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;
