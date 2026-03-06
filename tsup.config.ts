import { defineConfig } from 'tsup';
import { copyFileSync } from 'fs';

export default defineConfig([
  // React entry
  {
    entry: { index: 'src/index.tsx' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom'],
    banner: { js: "'use client';" },
    onSuccess: async () => {
      copyFileSync('src/tiptap.css', 'dist/tiptap.css');
      copyFileSync('src/vanilla/vanilla.css', 'dist/vanilla.css');
    },
  },
  // Vanilla entry
  {
    entry: { vanilla: 'src/vanilla.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: false,
    external: ['react', 'react-dom'],
  },
]);
