import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
import {qrcode} from 'vite-plugin-qrcode'
import {runtimeEnvScript} from 'vite-runtime-env-script-plugin'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 1440,
    watch: {
      usePolling: true,
    },
  },
  plugins: [
    react(),
    svgr(),
    qrcode(),
    tsconfigPaths({root: '.'}),
    runtimeEnvScript({
      variables: ['BASE_URL', 'YANDEX_MAP_API_KEY'],
    }),
  ],
})
