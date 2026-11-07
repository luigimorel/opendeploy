import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [TanStackRouterVite({ target: 'react' }), react(), tailwindcss()],
  server: {
    // `npm run dev` talks to the Go server started with `task run:http`
    proxy: { '/api': 'http://localhost:8080' },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
