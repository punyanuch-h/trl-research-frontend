import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    // Use the subpath for GitHub Pages (production mode without Vercel)
    // Use root for Vercel deployments and local development
    base: mode === "production" && !process.env.VERCEL ? "/trl-research-frontend/" : "/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 2000,
    },
  };
});
