import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/odbc/get_wifi': {
        target: 'http://111.68.124.187:9090',
        changeOrigin: true,
        headers: {
          'Accept': 'application/json'
        }
      }
    }
  },
  optimizeDeps: {
    include: ["vue", "vue-router", "pinia", "@vueuse/core"],
  },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
      },
      output: {
        manualChunks: {
          firebase: ["firebase/app", "firebase/firestore", "firebase/auth"],
          "vue-vendor": ["vue", "vue-router", "pinia"],
          leaflet: ["leaflet"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: false,
      },
      workbox: {
        sourcemap: false
      },
      manifest: {
        name: "The Anvaya App",
        short_name: "Anvaya",
        theme_color: "#1E3A8A",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
