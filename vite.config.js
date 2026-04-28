import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Railway hostnames are dynamic; allow external hosts for platform routing.
    allowedHosts: true,
  },
  preview: {
    // Railway hostnames are dynamic; allow external hosts for platform routing.
    allowedHosts: true,
  },
});
