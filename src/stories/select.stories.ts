import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/select.js';
import type { CtkSelectOption } from '../components/select.js';

const CHEESES: CtkSelectOption[] = [
  { value: 'cheddar', label: 'Cheddar', icon: '#e8a33d' },
  { value: 'gouda', label: 'Gouda', icon: '#d98324' },
  { value: 'swiss', label: 'Swiss', icon: 'linear-gradient(135deg,#f3e3a1,#e3c25f)' },
  { value: 'mozz', label: 'Mozzarella', icon: '#f6f2e7' },
];

const meta: Meta = {
  title: 'Components/Select',
  component: 'ctk-select',
  args: { label: 'Cheese', placeholder: 'Pick a cheese', hint: '' },
};
export default meta;

type Story = StoryObj;

export const WithIcons: Story = {
  render: (args) => html`
    <div style="max-width:260px;">
      <ctk-select label=${args.label} placeholder=${args.placeholder} hint=${args.hint} .options=${CHEESES}></ctk-select>
    </div>
  `,
};
