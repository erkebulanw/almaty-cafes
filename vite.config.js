import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      registerType: "prompt",
      injectRegister: false,
      manifest: false, // используем свой public/manifest.json
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,json}"],
        globIgnores: ["api/**"], // API не кладём в precache, у него своя стратегия
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
      devOptions: { enabled: false },
    }),
  ],
});