/* eslint-disable prettier/prettier */
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";
import path from "path";

export default defineConfig({
  plugins: [nitro({ preset: "vercel" })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});