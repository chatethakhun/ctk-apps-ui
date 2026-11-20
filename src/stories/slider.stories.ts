import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/slider.js';

const meta: Meta = {
  title: 'Components/Slider',
  component: 'ctk-slider',
  argTypes: {
    label: { control: 'text' },
    value: { control: { type: 'range', min: 0, max: 100 } },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    showValue: { control: 'boolean', name: 'show-value' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Brightness', value: 40, min: 0, max: 100, step: 1, showValue: true, disabled: false },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="width:280px">
      <ctk-slider
        label=${args.label}
        .value=${args.value}
        .min=${args.min}
        .max=${args.max}
        .step=${args.step}
        ?show-value=${args.showValue}
        ?disabled=${args.disabled}
      ></ctk-slider>
    </div>
  `,
};
