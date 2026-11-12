import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { showToast } from '../components/toast.js';

const meta: Meta = {
  title: 'Components/Toast',
  args: { message: 'Panel saved' },
  argTypes: { message: { control: 'text' } },
};
export default meta;

type Story = StoryObj<{ message: string }>;

export const Variants: Story = {
  render: (args) => {
    const fire = (variant: 'info' | 'success' | 'warning' | 'danger') =>
      showToast(args.message, { variant, duration: 0 });
    return html`
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button @click=${() => fire('info')}>Info</button>
        <button @click=${() => fire('success')}>Success</button>
        <button @click=${() => fire('warning')}>Warning</button>
        <button @click=${() => fire('danger')}>Danger</button>
      </div>
    `;
  },
};
