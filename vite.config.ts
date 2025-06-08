import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import federation from "@originjs/vite-plugin-federation";
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    federation({
      name: "remote_app",
      filename: "remoteEntry.js",
      exposes: {
        "./Viewer3d": "./src/Viewer3d/Viewer3d.tsx",
        "./sendTo3d": "./src/Viewer3d/sendTo3d.ts",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  base: "/editor3d/",

  build: {
    modulePreload: true,
    copyPublicDir: true,
    target: "esnext",
    minify: true,
    cssCodeSplit: false,
    outDir: "../ArgDataV.Designer.V2.Vite/editor3d",
    // outDir: "dist/editor3d",
    assetsDir: "assets",
    assetsInlineLimit: 4096000,
    chunkSizeWarningLimit: 4096000,
    commonjsOptions: {
      transformMixedEsModules: false,
    },
    rollupOptions: {
      external: ["/static/css/github-dark.min.css?transform-only"],
      //  external: [new RegExp(".hdr")],
      output: {
        assetFileNames: "assets/[name].[ext]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name].js",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8042",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
      "/file": {
        target: "http://localhost:8042",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    conditions: ["browser", "import"],
  },
});
