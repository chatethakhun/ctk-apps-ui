import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/tooltip.js';
import '../components/button.js';

const meta: Meta = {
  title: 'Components/Tooltip',
  component: 'ctk-tooltip',
  argTypes: { text: { control: 'text' }, placement: { control: 'select', options: ['top', 'bottom'] } },
  args: { text: 'Save your panel', placement: 'top' },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="padding: 60px 0">
      <ctk-tooltip text=${args.text} placement=${args.placement}>
        <button type="button">Hover or focus me</button>
      </ctk-tooltip>
    </div>
  `,
};
