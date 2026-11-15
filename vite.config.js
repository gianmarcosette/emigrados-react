import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Al compilar, le pasa a public/sw.js la lista de archivos del juego para que el celular
// los guarde y Emigrados abra sin conexión. La versión cambia cuando cambia algún archivo.
function offlineFiles() {
  return {
    name: 'emigrados-offline-files',
    apply: 'build',
    closeBundle() {
      const dist = resolve('dist')
      const assets = readdirSync(join(dist, 'assets'))
        .sort()
        .map((file) => `/assets/${file}`)
      const version = createHash('sha1').update(assets.join('\n')).digest('hex').slice(0, 8)
      const file = join(dist, 'sw.js')
      const source = readFileSync(file, 'utf8')
        .replace("'__VERSION__'", JSON.stringify(version))
        .replace('/* __ASSETS__ */', assets.map((asset) => JSON.stringify(asset)).join(', '))
      writeFileSync(file, source)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), offlineFiles()],
})
