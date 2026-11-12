import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/empty-state.js';
import '../components/button.js';

const meta: Meta = {
  title: 'Components/Empty State',
  component: 'ctk-empty-state',
  argTypes: { heading: { control: 'text' } },
  args: { heading: 'No panels yet' },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ctk-empty-state heading=${args.heading}>
      Create your first panel to start drawing your comic.
      <ctk-button slot="action" label="New panel"></ctk-button>
    </ctk-empty-state>
  `,
};
