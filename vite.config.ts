import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGithubPagesBuild = process.env.GITHUB_ACTIONS === 'true'

export default defineConfig({
  base: isGithubPagesBuild && repoName ? `/${repoName}/` : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
