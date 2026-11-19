import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/hamburger.js';

const meta: Meta = {
  title: 'Components/Hamburger',
  component: 'ctk-hamburger',
  argTypes: {
    label: { control: 'text' },
    open: { control: 'boolean' },
  },
  args: { label: 'Menu', open: false },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ctk-hamburger label=${args.label} ?open=${args.open}>
      <nav style="display:flex;flex-direction:column;gap:12px;font-weight:600">
        <a href="#">Home</a>
        <a href="#">Comics</a>
        <a href="#">Design System</a>
      </nav>
    </ctk-hamburger>
  `,
};

export const Open: Story = {
  args: { open: true },
  render: Default.render,
};
