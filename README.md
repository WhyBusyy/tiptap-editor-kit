# tiptap-editor-kit

[![NPM](https://img.shields.io/npm/v/tiptap-editor-kit.svg)](https://www.npmjs.com/package/tiptap-editor-kit)

`tiptap-editor-kit` | A ready-to-use Tiptap WYSIWYG editor with full toolbar, image upload, and table support — works with both React and Vanilla JS.

[한국어 문서](./README.ko.md)

## Features

- **React & Vanilla JS** — One package, two entry points
- **Full Toolbar** — Headings, formatting, font, color, alignment, image, link, list, table, clear formatting
- **Image Upload** — Drag & drop / paste / button click (all three supported)
- **Custom Upload Handler** — Plug in your own S3, Cloudinary, or any upload logic via `onImageUpload`
- **TypeScript** — Full type definitions included (d.ts)
- **ESM & CJS** — Dual module format support

---

## Installation

```bash
npm install tiptap-editor-kit
```

## Peer Dependencies

If you're using the React version, the following packages are required:

```bash
npm install react react-dom
```

**Note**: If you only use the Vanilla JS version, `react` and `react-dom` are not required. (optional peer dependency)

---

# React

Use as a React component in your project.

## Basic Usage

```tsx
import { useState } from 'react';
import TiptapEditor from 'tiptap-editor-kit';
import 'tiptap-editor-kit/styles.css';

function App() {
  const [content, setContent] = useState('<p>Hello World</p>');

  return <TiptapEditor content={content} setContent={setContent} />;
}
```

## With Custom Image Upload

```tsx
import { useState } from 'react';
import TiptapEditor from 'tiptap-editor-kit';
import 'tiptap-editor-kit/styles.css';

function App() {
  const [content, setContent] = useState('');

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const { url } = await res.json();
    return url;
  };

  return (
    <TiptapEditor
      content={content}
      setContent={setContent}
      onImageUpload={handleImageUpload}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `content` | `string` | Yes | — | HTML string to display in the editor |
| `setContent` | `Dispatch<SetStateAction<string>>` | Yes | — | State setter function for content |
| `onImageUpload` | `(file: File) => Promise<string>` | No | `URL.createObjectURL` | Upload handler that receives a file and returns a URL |

---

# Vanilla JS

Use without React in plain JavaScript/TypeScript projects.

## Basic Usage

```ts
import { createTiptapEditor } from 'tiptap-editor-kit/vanilla';
import 'tiptap-editor-kit/styles.css';
import 'tiptap-editor-kit/vanilla.css';

const instance = createTiptapEditor({
  element: document.getElementById('editor')!,
  content: '<p>Hello World</p>',
  onUpdate: (html) => {
    console.log('Updated:', html);
  },
});
```

## With Custom Image Upload

```ts
import { createTiptapEditor } from 'tiptap-editor-kit/vanilla';
import 'tiptap-editor-kit/styles.css';
import 'tiptap-editor-kit/vanilla.css';

const instance = createTiptapEditor({
  element: document.getElementById('editor')!,
  content: '',
  onUpdate: (html) => {
    document.getElementById('output')!.textContent = html;
  },
  onImageUpload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const { url } = await res.json();
    return url;
  },
});
```

## Options

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `element` | `HTMLElement` | Yes | — | DOM element to mount the editor |
| `content` | `string` | No | `''` | Initial HTML content |
| `onUpdate` | `(html: string) => void` | No | — | Callback fired on content change |
| `onImageUpload` | `(file: File) => Promise<string>` | No | `URL.createObjectURL` | Image upload handler |

## Instance Methods

| Method | Return | Description |
| --- | --- | --- |
| `getHTML()` | `string` | Returns the current editor HTML |
| `setContent(html)` | `void` | Sets the editor content |
| `destroy()` | `void` | Destroys the editor and cleans up DOM |
| `editor` | `Editor` | Direct access to the tiptap Editor instance |

---

## CSS Imports

Import the stylesheets based on your environment:

| Import Path | Description | React | Vanilla |
| --- | --- | --- | --- |
| `tiptap-editor-kit/styles.css` | Editor content area styles (headings, lists, tables, blockquotes, etc.) | Required | Required |
| `tiptap-editor-kit/vanilla.css` | Toolbar UI styles (works without Tailwind) | — | Required |

**Note**: The React version uses Tailwind CSS classes for the toolbar. Your project must have Tailwind configured for the toolbar to render correctly.

---

## Toolbar Features

| Group | Features |
| --- | --- |
| **History** | Undo, Redo |
| **Heading** | H1, H2, H3 |
| **Format** | Bold, Italic, Underline, Strikethrough |
| **Font** | Font size (12–32px), Font family (Arial, Georgia, etc.) |
| **Color** | Text color, Background color (15-color palette) |
| **Align** | Left, Center, Right |
| **Insert** | Image, Link, Bullet list, Ordered list, Blockquote |
| **Table** | Insert, Add/delete rows & columns, Merge/split cells, Delete table |
| **Etc** | Clear formatting |

---

## Project Structure

```
src/
├── core/                    # Shared modules
│   ├── constants.ts         #   Colors, fonts, type definitions
│   ├── extensions.ts        #   Tiptap extensions configuration
│   └── image-handler.ts     #   Drop / paste / file-select handlers
├── react/                   # React version
│   ├── index.tsx            #   TiptapEditor component
│   └── toolbar.tsx          #   JSX toolbar
├── vanilla/                 # Vanilla JS version
│   ├── index.ts             #   createTiptapEditor() factory
│   ├── toolbar.ts           #   DOM-based toolbar
│   └── vanilla.css          #   Toolbar styles (no Tailwind)
├── tiptap.css               #   Editor content area styles (shared)
├── index.tsx                # React entry point
└── vanilla.ts               # Vanilla entry point
```

---

## License

This package is open-sourced software licensed under the [MIT license](LICENSE).
