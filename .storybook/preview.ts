import type { Preview } from '@storybook/web-components-vite';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import '../src/tokens.css';
import '../src/index.ts';

// Lets every story flip between the three theme states the components
// support: explicit light, explicit dark, and "system" (no override).
const withTheme = (story: () => unknown, context: { globals: { theme?: string } }) => {
  const theme = context.globals.theme ?? 'system';
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-ctk-theme');
  } else {
    document.documentElement.setAttribute('data-ctk-theme', theme);
  }
  return story();
};

const preview: Preview = {
  parameters: {
    backgrounds: { disabled: true },
    controls: { expanded: true },
    // Every story can be previewed at phone, tablet and desktop widths from
    // the viewport toolbar. Components respond to their own container width,
    // so a narrow viewport also shows the narrow layouts.
    viewport: {
      options: INITIAL_VIEWPORTS,
    },
  },

  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'CTK theme override',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
      },
    },
  },

  decorators: [withTheme as never],
  tags: ['autodocs']
};

export default preview;
