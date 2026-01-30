import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/vantage-point/",
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
  },
});
