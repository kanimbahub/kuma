import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// HTTPS en dev : obligatoire pour l'accès au micro (WebRTC)
// HTTPS in dev: required for microphone access (WebRTC)
export default defineConfig({
  plugins: [react(), basicSsl()],
})
