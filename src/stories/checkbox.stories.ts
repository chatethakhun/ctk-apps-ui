import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/checkbox.js';

const meta: Meta = {
  title: 'Components/Checkbox',
  component: 'ctk-checkbox',
  argTypes: { label: { control: 'text' }, checked: { control: 'boolean' }, disabled: { control: 'boolean' } },
  args: { label: 'Extra sauce', checked: false, disabled: false },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<ctk-checkbox label=${args.label} ?checked=${args.checked} ?disabled=${args.disabled}></ctk-checkbox>`,
};
