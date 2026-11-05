
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
      ],

      manifest: {
        name: "Zivnel - Online Shopping Store",
        short_name: "Zivnel",
        description:
          "Shop fashion, preloved clothes, accessories, stationery and everyday essentials online with Zivnel.",

        theme_color: "#ffffff",
        background_color: "#ffffff",

        display: "standalone",
        orientation: "portrait",

        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      workbox: {
        navigateFallback: "index.html",

        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,

        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg,woff2}",
        ],
      },

      devOptions: {
        enabled: false,
      },
    }),
  ],
});

