import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/modal.js';
import '../components/button.js';

const meta: Meta = {
  title: 'Components/Modal',
  component: 'ctk-modal',
  argTypes: { heading: { control: 'text' }, open: { control: 'boolean' } },
  args: { heading: 'Delete this panel?', open: true },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ctk-modal heading=${args.heading} ?open=${args.open}>
      This cannot be undone.
      <div slot="footer">
        <ctk-button label="Cancel"></ctk-button>
        <ctk-button label="Delete"></ctk-button>
      </div>
    </ctk-modal>
  `,
};
