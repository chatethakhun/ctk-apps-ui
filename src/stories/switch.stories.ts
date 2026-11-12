import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/switch.js';

const meta: Meta = {
  title: 'Components/Switch',
  component: 'ctk-switch',
  argTypes: { label: { control: 'text' }, checked: { control: 'boolean' }, disabled: { control: 'boolean' } },
  args: { label: 'Notifications', checked: false, disabled: false },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<ctk-switch label=${args.label} ?checked=${args.checked} ?disabled=${args.disabled}></ctk-switch>`,
};

export const On: Story = {
  args: { checked: true },
  render: Default.render,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
};
