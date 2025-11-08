import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      external: ['@wordpress/element'],
      output: {
        entryFileNames: 'assets/main.js',

        assetFileNames: (assetInfo) => {

          if (assetInfo.name.endsWith('.css')) {
            return 'assets/main.css';
          }

          return 'assets/[name].[ext]';
        },

        globals: {
          '@wordpress/element': 'wp.element',
        },
      },
    },
  },
});