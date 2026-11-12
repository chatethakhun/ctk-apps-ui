import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/file-upload.js';

const meta: Meta = {
  title: 'Components/File Upload',
  component: 'ctk-file-upload',
  argTypes: { accept: { control: 'text' }, multiple: { control: 'boolean' }, disabled: { control: 'boolean' } },
  args: { accept: 'image/*', multiple: true, disabled: false },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ctk-file-upload
      accept=${args.accept}
      ?multiple=${args.multiple}
      ?disabled=${args.disabled}
      @ctk-files=${(e: CustomEvent) => console.log('files', e.detail.files.length)}
    ></ctk-file-upload>
  `,
};
