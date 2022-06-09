/// <reference types="vitest" />
import { defineConfig, loadEnv, UserConfigExport } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const defaultConfig: UserConfigExport = {
    plugins: [react(), tsconfigPaths()],
    define: {
      'process.env.NODE_ENV': `"${mode}"`,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      restoreMocks: true,
      coverage: {
        reporter: ['text', 'html'],
        exclude: ['node_modules/', 'src/setupTests.ts'],
      },
    },
  };

  if (mode === 'development' && process.env.VITE_DEV_PROXY) {
    return {
      ...defaultConfig,
      server: {
        open: true,
        proxy: {
          '/api': {
            target: process.env.VITE_DEV_PROXY,
            changeOrigin: true,
            secure: false,
          },
        },
      },
    };
  }

  return defaultConfig;
});
