import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/button.js';

const meta: Meta = {
  title: 'Components/Button',
  component: 'ctk-button',
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    noArrow: { control: 'boolean', name: 'no-arrow' },
  },
  args: { label: 'Fire it up', disabled: false, noArrow: false },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ctk-button label=${args.label} ?disabled=${args.disabled} ?no-arrow=${args.noArrow}></ctk-button>
  `,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
};
