import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/stepper.js';

const meta: Meta = {
  title: 'Components/Stepper',
  component: 'ctk-stepper',
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: { orientation: 'horizontal', min: 0, max: 10, step: 1, disabled: false, label: 'Quantity' },
};
export default meta;

type Story = StoryObj;

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => html`
    <ctk-stepper orientation=${args.orientation} .min=${args.min} .max=${args.max} .step=${args.step} .value=${3} label=${args.label} ?disabled=${args.disabled}></ctk-stepper>
  `,
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: Horizontal.render,
};

export const Decimal: Story = {
  args: { step: 0.5, min: 0, max: 5 },
  render: (args) => html`
    <ctk-stepper orientation="horizontal" .min=${args.min} .max=${args.max} .step=${args.step} .value=${1} label="Scale"></ctk-stepper>
  `,
};
