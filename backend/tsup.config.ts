import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs'],
  target: 'es2020',
  outDir: 'build',
  clean: true,
  sourcemap: false,
  minify: false,
  splitting: false,
  bundle: true,
  external: [
    '@prisma/client',
    'prisma',
    'dotenv',
    'express',
    'jsonwebtoken',
    'bcryptjs',
    'zod',
    'cookie-parser',
    'axios',
  ],
  noExternal: [],
  treeshake: true,
  dts: false,
  onSuccess: 'echo "Build completed successfully!"',
})
