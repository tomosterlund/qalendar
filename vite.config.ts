/// <reference types="vitest" />
// @ts-ignore
import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Qalendar",
      fileName: (format) => `qalendar.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  plugins: [vue()],
  test: {
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    environment: "jsdom",
    coverage: {
      provider: 'c8',
      reporter: ['lcov', 'text', 'text-summary'],
    },
  },
});
