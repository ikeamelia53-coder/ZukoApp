import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 1. Tambahkan base path agar file CSS/JS terbaca di GitHub Pages
  base: '/ZukoApp/', 
  
  // 2. Masukkan semua plugin ke dalam satu array
  plugins: [
    react(),
    tailwindcss(), // Pastikan tailwindcss juga masuk di sini
  ],

  // 3. Pindahkan resolve ke dalam defineConfig (sebelum penutup })
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@lib': path.resolve(__dirname, './lib'),
    },
  },
})