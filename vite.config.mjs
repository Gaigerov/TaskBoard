import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(), 
    svgr({ 
      svgrOptions: {
      },
    }),
],
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