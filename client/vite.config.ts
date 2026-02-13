import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      components: path.resolve(__dirname, "src/components"),
      pages: path.resolve(__dirname, "src/pages"),
      utils: path.resolve(__dirname, "src/utils"),
      hook: path.resolve(__dirname, "src/hook"),
      contexts: path.resolve(__dirname, "src/contexts"),
      layout: path.resolve(__dirname, "src/layout"),
      constant: path.resolve(__dirname, "src/constant"),
      api: path.resolve(__dirname, "src/api"),
    },
  },
});
