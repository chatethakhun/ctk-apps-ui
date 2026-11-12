# @ctk-apps/ui

The CTK Apps comic-panel design system, as a framework-agnostic component
library. Every component is a [Lit](https://lit.dev)-powered Web Component —
one codebase, works natively in React, Vue, and plain HTML, with no
per-framework wrapper package to maintain.

## Install

```bash
npm install @ctk-apps/ui
```

## Theming

Import the token stylesheet once, globally, at your app's entry point:

```js
import '@ctk-apps/ui/tokens.css';
```

This unlocks dark-mode support. Every component also ships hardcoded
fallback values for each `--ctk-*` token, so components still render
correctly in light mode even if you skip this import — importing
`tokens.css` is only required to get the dark/light theme switching.

Three theme states are supported, same as the original design system:

- No `data-ctk-theme` attribute + light OS preference → light theme
- No `data-ctk-theme` attribute + dark OS preference → dark theme (via
  `prefers-color-scheme`)
- `data-ctk-theme="light"` or `data-ctk-theme="dark"` on `<html>` (or any
  ancestor) → explicit override, regardless of OS preference

`<ctk-theme-toggle>` manages this for you — drop it in anywhere and it
reads/writes `data-ctk-theme` on `<html>` and persists the choice to
`localStorage`.

## Usage

### Plain HTML

```html
<script type="module">
  import '@ctk-apps/ui';
</script>
<link rel="stylesheet" href="https://unpkg.com/@ctk-apps/ui/tokens.css" />

<ctk-button label="Fire it up"></ctk-button>
```

### React

Import once (e.g. in your root component or entry file) to register the
custom elements, then use them like any other JSX tag. Because these are
Web Components, state flows one way via props/attributes, and changes come
back out via native `CustomEvent`s rather than a controlled-component
callback prop — so bind events with a ref or an `on*` lowercase listener,
not a `onChange` prop:

```jsx
import { useEffect, useRef, useState } from 'react';
import '@ctk-apps/ui';
import '@ctk-apps/ui/tokens.css';

function CheeseField() {
  const [value, setValue] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const onChange = (e) => setValue(e.detail.value);
    el.addEventListener('ctk-change', onChange);
    return () => el.removeEventListener('ctk-change', onChange);
  }, []);

  return (
    <ctk-select
      ref={ref}
      label="Cheese"
      value={value}
      options={[
        { value: 'cheddar', label: 'Cheddar', icon: '#e8a33d' },
        { value: 'gouda', label: 'Gouda', icon: '#d98324' },
      ]}
    />
  );
}
```

React 19 passes unrecognized lowercase JSX attributes straight through as
DOM properties/attributes, and supports listening to custom events on
primitive elements directly, which is what makes this work without a
wrapper. On React 18 or earlier, set properties imperatively via the ref
instead of as JSX props for anything that isn't a plain string/number
attribute (like `options` above, which is a JS array — use
`el.options = [...]` in an effect).

### Vue

Vue natively forwards unrecognized kebab-case attributes and listens for
custom DOM events with `v-on`/`@`, so usage is close to idiomatic Vue —
you just use the `.prop` modifier for anything that isn't a plain string
(objects, arrays, booleans you want as real props rather than attributes):

```vue
<script setup>
import '@ctk-apps/ui';
import '@ctk-apps/ui/tokens.css';
import { ref } from 'vue';

const cheese = ref('');
const options = [
  { value: 'cheddar', label: 'Cheddar', icon: '#e8a33d' },
  { value: 'gouda', label: 'Gouda', icon: '#d98324' },
];
</script>

<template>
  <ctk-select
    label="Cheese"
    :value="cheese"
    :options.prop="options"
    @ctk-change="cheese = $event.detail.value"
  />
</template>
```

Tell Vue these are custom elements (not Vue components) so it doesn't warn
about unknown tags — in `vite.config.js`:

```js
export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('ctk-'),
        },
      },
    }),
  ],
};
```

## Components

| Element | Notes |
| --- | --- |
| `<ctk-button>` | `label`, `disabled`, `no-arrow`. Fires `ctk-click`. |
| `<ctk-card>` | `card-title`, `body`, `href`, `tilt`, `tile-color`. Slots: `illustration`, `body`, `cta`. |
| `<ctk-theme-toggle>` | `target` (`"html"` \| `"self"`). Fires `ctk-theme-change`. |
| `<ctk-text-input>` | `label`, `value`, `placeholder`, `type`, `hint`, `error`, `disabled`. Fires `ctk-input`, `ctk-change`. |
| `<ctk-textarea>` | Same field props as text-input, plus `rows`. |
| `<ctk-select>` | `label`, `value`, `placeholder`, `options` (array of `{ value, label, icon? }`, `icon` is any CSS `background`). Fires `ctk-change`. |
| `<ctk-checkbox>` | `label`, `checked`, `disabled`. Fires `ctk-change` with `{ checked }`. |
| `<ctk-radio>` | `name`, `value`, `label`, `checked`, `disabled`. Fires `ctk-change` with `{ value }` on the radio that became checked. |
| `<ctk-datepicker>` | `label`, `mode` (`"single"` \| `"range"`), `start-date`, `end-date` (ISO `YYYY-MM-DD`). Popup with Cancel/Apply. Fires `ctk-change` with `{ start, end }`. |
| `<ctk-top-nav>` | `links` (array of `{ label, href?, active? }`). Fires `ctk-nav`. |
| `<ctk-side-nav>` | `items` (array of `{ label, href?, icon?, active? }`), `collapsible`, `collapsed`. Fires `ctk-nav`, `ctk-collapse-change`. |
| `<ctk-pagination>` | `page`, `total-pages`. Prev/Next only — no page-number list. Fires `ctk-page-change`. |
| `<ctk-tabs>` | `tabs` (array of `{ value, label, disabled? }`), `value`. A pill selector only — render your own panel content based on `value`. Fires `ctk-change`. |

Full interactive docs, props tables, and live controls for every component
are in Storybook:

```bash
npm run storybook
```

## Development

```bash
npm install
npm run build          # type declarations (tsc) + library bundle (vite)
npm run storybook       # interactive docs at http://localhost:6006
npm run build-storybook # static docs build
```

## Publishing

This package is scoped (`@ctk-apps/ui`) with `publishConfig.access: public`,
so it can publish without a paid npm organization. To publish a new
version:

```bash
npm version patch   # or minor / major
npm run build        # prepublishOnly also runs this automatically
npm login            # if not already logged in
npm publish
```
