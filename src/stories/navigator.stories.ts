import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/top-nav.js';
import '../components/side-nav.js';
import '../components/pagination.js';
import '../components/tabs.js';

const meta: Meta = {
  title: 'Components/Navigator',
};
export default meta;

type Story = StoryObj;

export const TopNav: Story = {
  render: () => html`
    <ctk-top-nav
      .links=${[
        { label: 'Home', href: '#', active: true },
        { label: 'Apps', href: '#' },
        { label: 'Design System', href: '#' },
      ]}
    ></ctk-top-nav>
  `,
};

export const SideNav: Story = {
  render: () => html`
    <ctk-side-nav
      .items=${[
        { label: 'Home', icon: '#7c5cff', active: true },
        { label: 'Apps', icon: '#ff5a7a' },
        { label: 'Design System', icon: '#e8a33d' },
      ]}
    ></ctk-side-nav>
  `,
};

export const Pagination: Story = {
  render: () => html`<ctk-pagination page="3" total-pages="12"></ctk-pagination>`,
};

export const Tabs: Story = {
  render: () => html`
    <ctk-tabs
      value="apps"
      .tabs=${[
        { value: 'home', label: 'Home' },
        { value: 'apps', label: 'Apps' },
        { value: 'design', label: 'Design System' },
      ]}
    ></ctk-tabs>
  `,
};
