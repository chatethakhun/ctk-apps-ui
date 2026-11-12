import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/breadcrumb.js';

const meta: Meta = {
  title: 'Components/Breadcrumb',
  component: 'ctk-breadcrumb',
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <ctk-breadcrumb
      .items=${[
        { label: 'Home', href: '#' },
        { label: 'Comics', href: '#' },
        { label: 'Issue #3' },
      ]}
    ></ctk-breadcrumb>
  `,
};
