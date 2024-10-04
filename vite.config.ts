import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Lista-de-gerenciamento-de-tarefas/', 
  plugins: [vue()],
})
