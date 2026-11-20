import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/carousel.js';

const meta: Meta = {
  title: 'Components/Carousel',
  component: 'ctk-carousel',
  argTypes: {
    index: { control: 'number' },
    hideControls: { control: 'boolean' },
  },
  args: { index: 0, hideControls: false, label: 'Featured' },
};
export default meta;

type Story = StoryObj;

const slideStyle =
  'display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:220px;padding:24px;background:var(--ctk-accent-soft,#efe9ff);font-family:var(--ctk-font-display,Bangers,sans-serif);font-size:2rem;letter-spacing:0.03em;';

export const Default: Story = {
  render: (args) => html`
    <ctk-carousel label=${args.label} index=${args.index} ?hide-controls=${args.hideControls}>
      <div style=${slideStyle}>Slide one</div>
      <div style=${slideStyle}>Slide two</div>
      <div style=${slideStyle}>Slide three</div>
    </ctk-carousel>
  `,
};

export const HiddenControls: Story = {
  args: { hideControls: true },
  render: Default.render,
};

export const SingleSlide: Story = {
  render: (args) => html`
    <ctk-carousel label=${args.label}>
      <div style=${slideStyle}>Only slide</div>
    </ctk-carousel>
  `,
};
