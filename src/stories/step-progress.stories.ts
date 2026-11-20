import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/step-progress.js';

const meta: Meta = {
  title: 'Components/Step Progress',
  component: 'ctk-step-progress',
  argTypes: {
    current: { control: 'number' },
  },
  args: { current: 1 },
};
export default meta;

type Story = StoryObj;

const flow = ['Cart', 'Shipping', 'Payment', 'Done'];

export const Default: Story = {
  render: (args) => html`
    <ctk-step-progress .steps=${flow} .current=${args.current}></ctk-step-progress>
  `,
};

export const First: Story = {
  args: { current: 0 },
  render: Default.render,
};

export const Finished: Story = {
  args: { current: 4 },
  render: Default.render,
};
