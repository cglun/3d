import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tanstackRouter from "@tanstack/router-plugin/vite";
// 修改为默认导入
import federation from "@originjs/vite-plugin-federation";
import { visualizer } from "rollup-plugin-visualizer";

import { resolve } from "path";

declare module "@originjs/vite-plugin-federation" {
  interface SharedConfig {
    singleton?: boolean;
    eager?: boolean;
  }
}

export default defineConfig({
  plugins: [
    react(),
    tanstackRouter,
    federation({
      name: "remote_app",
      filename: "remoteEntry.js",
      exposes: {
        "./Viewer3d": "./src/Viewer3d/Viewer3d.tsx",
        "./sendTo3d": "./src/Viewer3d/sendTo3d.ts",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.3.1" },
        "react-dom": { singleton: true, requiredVersion: "^18.3.1" },
        bootstrap: { singleton: true, requiredVersion: "^5.3.6" },
        three: { singleton: true, requiredVersion: "^0.177.0" },
        axios: { singleton: true, requiredVersion: "^1.10.0" },
        "@static/js/@monaco-editor/react": { singleton: true },
        "@static/js/react-monaco-editor": { singleton: true },

        // "@static/file3d/hdr/venice_sunset_1k.hdr?url": {
        //   singleton: false,
        // },
        // "@static/file3d/hdr/spruit_sunrise_1k.hdr?url": {
        //   singleton: false,
        // },
      },
    }),
    visualizer({
      open: false, // 打包完成后自动打开可视化页面
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  base: "/editor3d/",
  build: {
    modulePreload: true,
    copyPublicDir: true,
    target: "esnext",
    minify: true,
    // minify: false,
    cssCodeSplit: false,
    outDir: "../ArgDataV.Designer.V2.Vite/editor3d",
    //outDir: "dist/editor3d",
    assetsDir: "assets",
    assetsInlineLimit: 2048,
    chunkSizeWarningLimit: 1024,
    commonjsOptions: {
      transformMixedEsModules: false,
    },

    rollupOptions: {
      external: [
        "@static/css/github-dark.min.css?transform-only",
        "@static/js/@monaco-editor/react",
        "@static/js/react-monaco-editor",
        // "@static/file3d/hdr/spruit_sunrise_1k.hdr?url",
        // "@static/file3d/hdr/venice_sunset_1k.hdr?url",
        //new RegExp(".hdr"),
      ],
      //  external: [new RegExp(".hdr")],
      output: {
        assetFileNames: "assets/[name].[ext]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name].js",
        manualChunks: {
          // 将 React 相关依赖打包到一个单独的 chunk 中
          react: ["react", "react-dom"],
          // 将第三方库打包到一个单独的 chunk 中
          vendor: ["axios", "bootstrap", "three"],
          // 可以根据需要添加更多的 chunk
        },
      },
    },
  },
  optimizeDeps: {
    exclude: [
      "@static/js/@monaco-editor/react",
      "@static/js/react-monaco-editor",
    ],
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
    alias: {
      "@": resolve(__dirname, "src"),
      "@static": resolve(__dirname, "./public/static/"),
    },
  },
});
