import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/card.js';

const meta: Meta = {
  title: 'Components/Card',
  component: 'ctk-card',
  argTypes: {
    cardTitle: { control: 'text', name: 'card-title' },
    body: { control: 'text' },
    href: { control: 'text' },
    tilt: { control: { type: 'range', min: -8, max: 8, step: 0.5 } },
    tileColor: { control: 'color', name: 'tile-color' },
  },
  args: {
    cardTitle: 'Grilled Cheese Supreme',
    body: 'Three cheeses, pressed hot, cut on the diagonal because rules matter.',
    href: '#',
    tilt: -2,
    tileColor: '#ffd36e',
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:280px;">
      <ctk-card
        card-title=${args.cardTitle}
        body=${args.body}
        href=${args.href}
        tilt=${args.tilt}
        tile-color=${args.tileColor}
      ></ctk-card>
    </div>
  `,
};
