import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/dropdown.js';

const meta: Meta = {
  title: 'Components/Dropdown',
  component: 'ctk-dropdown',
  argTypes: { label: { control: 'text' }, disabled: { control: 'boolean' } },
  args: { label: 'Actions', disabled: false },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ctk-dropdown label=${args.label} ?disabled=${args.disabled}>
      <button role="menuitem" value="edit">Edit</button>
      <button role="menuitem" value="duplicate">Duplicate</button>
      <button role="menuitem" value="delete">Delete</button>
    </ctk-dropdown>
  `,
};
