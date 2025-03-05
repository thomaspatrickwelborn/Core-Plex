import { readFile } from 'node:fs/promises'
import certificates from './certificates.js'
export default {
  name: "Core Plex | Demonstrament",
  inspector: {
    port: 9243,
    host: "127.0.0.1",
  },
  server: {
    https: {
      key: await readFile(certificates.key.path),
      cert: await readFile(certificates.cert.path),
      port: 3346,
      host: "demonstrament.core-plex",
    },
  },
  browserSync: {
    logPrefix: "Core-Plex | Demonstrament",
    port: 3347,
    open: false,
    ui: false, 
    ghostMode: false,
    host: "demonstrament.core-plex",
    https: {
      key: certificates.key.path,
      cert: certificates.cert.path,
    },
    files: [
      'static/*.{js,css,html}',
      'localhost/*.{js,css,html}',
    ],
    proxy: {
      ws: true,
    },
    reloadDelay: 500,
    reloadDebounce: 500,
    reloadThrottle: 0,
    injectChanges: true,
  },
  sockets: {
    host: "demonstrament.core-plex",
    config: '$socket.js',
    source: 'documents',
    target: 'localhost',
  },
  routers: {
    config: '$router.js',
    source: 'documents',
    target: 'localhost',
  },
  documents: {
    config: '$document.js',
    source: 'documents',
    target: 'localhost',
  },
}