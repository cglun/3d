import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    federation({
      name: "remote_app",
      filename: "remoteEntry.js",
      exposes: {
        "./Viewer3d": "./src/Viewer3d/Viewer3d.tsx",
        "./init3dViewer": "./src/three/init3dViewer.ts",
      },
      shared: [
        "react",
        "react-dom",
        // "@tanstack/react-router",
        //"bootstrap",
        // "@originjs/vite-plugin-federation",
        //"bootstrap-icons",
        //"react-bootstrap",
        // "three",
      ],
      // import "bootstrap/dist/css/bootstrap.css";
      // import "bootstrap-icons/font/bootstrap-icons.css";
    }),
  ],
  base: "/editor3d/",
  build: {
    modulePreload: true,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    outDir: "../ArgDataV.Designer.V2.Vite/editor3d",
    //outDir: "../datav_vr_2d/editor3d",
    // outDir: "editor3d",
    assetsDir: "assets",
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 4096,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      //external: [new RegExp("/init3dViewer/.*")],

      output: {
        // manualChunks: (id) => {
        //   if (id.includes("node_modules")) {
        //     return "xx";
        //   }
        // },
        assetFileNames: "assets/[name].[ext]",
        chunkFileNames: (parameter) => {
          if (parameter.name.includes("xx")) {
            return "assets/[name].js";
          } else {
            return "assets/[name]-[hash].js";
          }
        },
        entryFileNames: "assets/[name].js",
        // entryFileNames: "assets/[name]-[hash].[js]",
      },
    },

    terserOptions: {
      compress: {
        // 禁用变量名的混淆
        toplevel: false, // 或者使用 drop_console: false 来禁用 console 语句的删除
        // 可以进一步细化配置以保留更多信息，例如保留变量名：
        keep_fnames: true, // 保留函数名
        keep_classnames: true, // 保留类名
      },
      mangle: false, // 禁用变量名的重命名
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
