import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/number-field.js';

const meta: Meta = {
  title: 'Components/Number Field',
  component: 'ctk-number-field',
  argTypes: {
    label: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    hideStepper: { control: 'boolean', name: 'hide-stepper' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Panels', min: 1, max: 12, step: 1, hideStepper: false, disabled: false },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ctk-number-field
      label=${args.label}
      .value=${4}
      .min=${args.min}
      .max=${args.max}
      .step=${args.step}
      ?hide-stepper=${args.hideStepper}
      ?disabled=${args.disabled}
      hint="Between 1 and 12"
    ></ctk-number-field>
  `,
};

export const NoStepper: Story = {
  args: { hideStepper: true },
  render: Default.render,
};
