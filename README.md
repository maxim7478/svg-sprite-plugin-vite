# SVG Sprite Plugin Vite 

**SVG Sprite Plugin Vite** is a lightweight Vite plugin that automatically collects all SVG files from a specified directory, combines them into a single SVG sprite, and injects it directly into your HTML. It supports **Hot Module Replacement (HMR)** during development and ensures seamless integration with modern frameworks like Vue, React, or plain HTML projects.

---

## Features

- 🌟 **Automatic SVG Sprite Generation**: Combines all SVG files into a single sprite using `<symbol>` tags.
- 🔧 **HTML Injection**: The generated sprite is automatically injected into the `<body>` of your application.
- 🔥 **Hot Module Replacement (HMR)**: Automatically updates the sprite when SVG files change during development.
- 🛠️ **Customizable**: Configure the source directory for SVG files and XML namespace (`xmlns`).

---

## Installation

Install the plugin via npm:

```bash
npm install svg-sprite-plugin-vite
```

```bash
yarn add svg-sprite-plugin-vite
```

1. Configure the Plugin in vite.config.ts
Add the plugin to your Vite configuration:


```typescript
import { defineConfig } from 'vite';
import svgSpritePlugin from 'svg-sprite-plugin-vite';

export default defineConfig({
    plugins: [
        svgSpritePlugin( 
            './src/assets/icons', // Directory containing SVG files
            'http://www.w3.org/2000/svg', // XML namespace (default)
        ),
    ],
});
```

2. Using Icons from the Sprite
To display icons from the sprite, use the <svg> tag with the <use> attribute:
```html
<svg>
  <use href="#icon-name"></use>
</svg>
```
Here, icon-name corresponds to the name of the SVG file without the .svg extension.


Example Project Structure

```html
my-project/
├── src/
│   ├── assets/
│   │   └── icons/       # Source SVG files
│   │       ├── home.svg
│   │       ├── settings.svg
│   │       └── user.svg
│   └── components/
│       └── KitIcon.vue  # Component for displaying icons
├── vite.config.ts       # Vite configuration
└── package.json         # Project dependencies
```

```vue
<template>
  <svg>
    <use :xlink:href="computedIconHref" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  icon: string; // Icon name (without extension)
}>();

const computedIconHref = computed(() => {
  return `#${props.icon}`;
});
</script>

<style scoped>
svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
</style>
```

Using the component:

```vue
<template>
  <div>
    <KitIcon icon="home" />
    <KitIcon icon="settings" />
    <KitIcon icon="user" />
  </div>
</template>

<script setup>
import KitIcon from '@/components/KitIcon.vue';
</script>
```

### How It Works
Development Mode :
 - The plugin watches the specified directory for changes to SVG files.
 - When an SVG file is modified, the sprite is regenerated, and the page reloads automatically.

Production Mode :
 - During the build process, the plugin generates the sprite once and injects it into the HTML.

HTML Injection :
 - The sprite is added to the <body> of your application, making it globally available.

### License
This project is distributed under the MIT License .

### Support 

If you encounter any issues or have questions, feel free to open an issue in the repository:

### Issues

You can also reach out to the author directly:

GitHub: @maxim7478

### Acknowledgments
Thank you for using Vite Plugin SVG Sprite ! If you find this plugin helpful, please consider starring the repository:

