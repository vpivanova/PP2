import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
 
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    include: ['**/*.test.tsx'], // Указываем, что файлы тестов имеют расширение .test.tsx
    exclude: [
      ...configDefaults.exclude,
      '**/e2e/**', // Исключаем папку с тестами Playwright
    ],
  },
})