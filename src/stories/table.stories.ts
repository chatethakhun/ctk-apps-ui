import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/table.js';
import type { CtkTable } from '../components/table.js';

const meta: Meta = {
  title: 'Components/Table',
  component: 'ctk-table',
  argTypes: { selectable: { control: 'boolean' } },
  args: { selectable: true },
};
export default meta;

type Story = StoryObj;

const columns = [
  { key: 'name', label: 'Panel', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'views', label: 'Views', sortable: true },
];
const rows = [
  { name: 'Opening splash', status: 'Published', views: 1240 },
  { name: 'Chase scene', status: 'Draft', views: 0 },
  { name: 'Final panel', status: 'Scheduled', views: 310 },
];

export const Default: Story = {
  render: (args) => html`
    <ctk-table
      .columns=${columns}
      .rows=${rows}
      ?selectable=${args.selectable}
      @ctk-sort=${(e: CustomEvent) => console.log('sort', e.detail)}
    ></ctk-table>
  `,
};

export const Empty: Story = {
  render: () => html`<ctk-table .columns=${columns} .rows=${[]}></ctk-table>`,
};
