import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/skeleton.js';

const meta: Meta = {
  title: 'Components/Skeleton',
  component: 'ctk-skeleton',
};
export default meta;

type Story = StoryObj;

export const Card: Story = {
  render: () => html`
    <div style="display:flex;gap:12px;align-items:center;width:280px">
      <ctk-skeleton shape="circle" width="48px" height="48px"></ctk-skeleton>
      <div style="flex:1;display:flex;flex-direction:column;gap:8px">
        <ctk-skeleton shape="text" width="70%"></ctk-skeleton>
        <ctk-skeleton shape="text" width="45%"></ctk-skeleton>
      </div>
    </div>
  `,
};
