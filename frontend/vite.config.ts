import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Build config (safe for Docker + production)
  build: {
    sourcemap: false,
    outDir: 'dist',
    emptyOutDir: true,
  },

  // Dev server (optional but useful)
  server: {
    port: 5173,
    strictPort: true,
  },

  // Vitest configuration (THIS is the correct place)
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
  },
});
