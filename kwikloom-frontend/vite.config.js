import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // <-- Add this

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"), // <-- fix here
    },
  },
  server: {
    historyApiFallback: true,
  },
});
