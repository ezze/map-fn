import path from 'path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ include: ['lib'] })],
  build: {
    lib: {
      name: 'MapFn',
      fileName: (format, entryName) => `${entryName}.${format}.js`,
      entry: path.resolve(__dirname, 'lib/index.ts'),
      formats: ['es', 'umd']
    }
  }
});
