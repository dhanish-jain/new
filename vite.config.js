import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
 codex/review-and-fix-github-repo-for-railway-deployment-h13fbo
  server: {
    // Railway hostnames are dynamic; allow external hosts for platform routing.
    allowedHosts: true,
  },
  preview: {
    // Railway hostnames are dynamic; allow external hosts for platform routing.
    allowedHosts: true,
  },

 main
});
