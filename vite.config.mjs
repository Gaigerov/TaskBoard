import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, 
    open: true, 
    cors: true,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: './src/config/App.css',
      },
    },
  },
});