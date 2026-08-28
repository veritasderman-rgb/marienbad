import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    // Integrační testy proti DB se přeskakují bez TEST_DATABASE_URL (viz tests/README)
  },
})
