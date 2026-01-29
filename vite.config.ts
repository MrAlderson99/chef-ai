import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Change 'chef-gourmet-ai' to your actual GitHub repository name
  // If your repo is https://github.com/username/my-cool-chef, change this to '/my-cool-chef/'
  base: '/chef-gourmet-ai/', 
})