import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    base: "/TaskBoard/",
    plugins: [
        react(),
        svgr({
            svgrOptions: {
            },
        }),
    ],
    server: {
        port: 5174,
        open: true,
        cors: true,
        proxy: {
            '/api': {
              target: 'https://simple-storage.vigdorov.ru',
              changeOrigin: true,
              secure: false,
              rewrite: (path) => path.replace(/^\/api/, '')
            }
          }
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
    // css: {
    //     preprocessorOptions: {
    //         scss: {
    //             additionalData: '../src/config/App.css',
    //         },
    //     },
    // },
});