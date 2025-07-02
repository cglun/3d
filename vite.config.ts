import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tanstackRouter from "@tanstack/router-plugin/vite";
// 修改为默认导入
import federation from "@originjs/vite-plugin-federation";
import { resolve } from "path";
declare module "@originjs/vite-plugin-federation" {
  interface SharedConfig {
    singleton?: boolean;
    eager?: boolean;
  }
}
const manualChunksConfig = {
  // 将 React 相关依赖打包到一个单独的 chunk 中
  react: ["react", "react-dom"],
  // 将第三方库打包到一个单独的 chunk 中
  // vendor: ["axios", "bootstrap", "three"],
  three: ["three"],
  bootstrap: ["bootstrap"],
  axios: ["axios"],
  // 将 monaco-editor 相关依赖打包到一个单独的 chunk 中
  monaco: ["react-monaco-editor", "@monaco-editor/react"],
  // 可以根据需要添加更多的 chunk
};
const excludeFile = [
  // "@react-monaco-editor",
  // "@monaco-editor/react",
  "bootstrap",
  // "three",
  // "axios",
  // "@static/file3d/hdr/spruit_sunrise_1k.hdr?url",
];
export default defineConfig({
  plugins: [
    react(),
    tanstackRouter(),
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
        //  bootstrap: { singleton: true, requiredVersion: "^5.3.7" },
        // three: { singleton: true, requiredVersion: "^0.177.0" },
        // axios: { singleton: true, requiredVersion: "^1.10.0" },
        // "@monaco-editor/react": { singleton: true },
        // "react-monaco-editor": { singleton: true },
        // "@static/css/github-dark.min.css": { singleton: true },
        // "@static/file3d/hdr/venice_sunset_1k.hdr?url": {
        //   singleton: false,
        // },
        // "@static/file3d/hdr/spruit_sunrise_1k.hdr?url": {
        //   singleton: false,
        // },
      },
    }),
  ],
  base: "/editor3d/",
  build: {
    modulePreload: true,
    copyPublicDir: true,
    target: "esnext",
    minify: true,
    //minify: false,
    cssCodeSplit: false,
    outDir: "../ArgDataV.Designer.V2.Vite/editor3d",
    // outDir: "dist/editor3d",
    assetsDir: "assets",
    assetsInlineLimit: 2048,
    chunkSizeWarningLimit: 1024,
    commonjsOptions: {
      transformMixedEsModules: false,
    },

    rollupOptions: {
      external: [
        ...excludeFile,
        // "@static/file3d/hdr/spruit_sunrise_1k.hdr?url",
        // "@static/file3d/hdr/venice_sunset_1k.hdr?url",
        //new RegExp(".hdr"),
      ],
      //  external: [new RegExp(".hdr")],
      output: {
        assetFileNames: "assets/static/css/[name].[ext]",
        // chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name].js",
        manualChunks: manualChunksConfig,
        chunkFileNames: (chunkInfo) => {
          if (Object.keys(manualChunksConfig).includes(chunkInfo.name)) {
            return `assets/static/js/vendor/${chunkInfo.name}.js`;
          }
          if (chunkInfo.name.includes("__federation")) {
            return `assets/static/js/federation/${chunkInfo.name}.js`;
          }
          return `assets/static/js/chunks/${chunkInfo.name}-[hash].js`;
        },
      },
    },
  },
  optimizeDeps: {
    exclude: excludeFile,
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
