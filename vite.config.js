import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/eradityayadav.com/' : '/',
  build: {
    chunkSizeWarningLimit: 1000, // raise limit to 1000 kB
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split heavy dependencies into their own chunks
          if (id.includes('node_modules/three')) {
            return 'three';
          }
          if (id.includes('node_modules/motion')) {
            return 'motion';
          }
        },
      },
    },
  },
}));
