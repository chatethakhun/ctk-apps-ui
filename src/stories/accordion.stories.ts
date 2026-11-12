import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/accordion.js';

const meta: Meta = {
  title: 'Components/Accordion',
  component: 'ctk-accordion',
  argTypes: { exclusive: { control: 'boolean' } },
  args: { exclusive: true },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ctk-accordion ?exclusive=${args.exclusive}>
      <details open>
        <summary>What is a panel?</summary>
        <p>A single frame of a comic page.</p>
      </details>
      <details>
        <summary>How do I export?</summary>
        <p>Use the export button in the top bar.</p>
      </details>
    </ctk-accordion>
  `,
};
