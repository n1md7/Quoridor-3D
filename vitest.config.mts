/// <reference types="vitest" />

import { cwd } from 'node:process';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: cwd(),
    alias: {
      '/src': cwd() + '/src',
      '/common': cwd() + '/libs/common/src',
      '/package.json': cwd() + '/package.json',
    },
    coverage: {
      reportsDirectory: 'reports/coverage',
      reporter: [
        "json",
        "lcov",
        "text",
        "text-summary",
        "clover",
        "cobertura"
      ],
      provider: 'v8',
      exclude: [
        '**/node_modules/**',
        '**/bootstrap/**',
        '**/exceptions/**',
        '**/validations/**',
        '**/decorators/**',
        '**/test/**',
        '**/scripts/**',
        '**/*.module.ts',
        '**/*.interceptor.ts',
        '**/*.filter.ts',
        '**/main.ts',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.d.ts',
        '**/*.type.ts',
        '**/*.schema.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '/src': cwd(),
      '/common': cwd() + '/libs/common/src',
      '/package.json': cwd() + '/package.json',
    },
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
  ],
});
