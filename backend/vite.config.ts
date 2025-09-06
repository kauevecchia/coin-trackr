import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    environmentMatchGlobs: [['src/http/controllers/**', 'node']],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/prisma/**',
      '**/src/generated/**',
    ],

    deps: {
      external: [
        /@prisma\/client/,
        /prisma-client/,
        /dotenv/,
        'express',
        'jsonwebtoken',
        'bcryptjs',
        'zod',
        'cookie-parser',
        'axios',
      ],
      inline: ['tsx'],
    },

    environment: 'node',
    globals: true,
    clearMocks: true,
    mockReset: true,
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
})
