import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Stejný alias jako v tsconfig.json, ať jdou testovat i moduly ze `src/`,
  // které importují přes `@/…` (např. src/lib/hotelPhotos.ts).
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    // Integrační testy proti DB se přeskakují bez TEST_DATABASE_URL (viz tests/README)
  },
})
