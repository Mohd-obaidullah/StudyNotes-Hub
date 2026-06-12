// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     proxy: {
//       "/auth": "http://localhost:5000",
//       "/api": "http://localhost:5000",
//       // "/notes": "http://localhost:5000",
//       // "/payments": "http://localhost:5000",
//       // "/admin": "http://localhost:5000",
//       // "/categories": "http://localhost:5000",
//       // "/health": "http://localhost:5000",
//       "/uploads": "http://localhost:5000",
//       // "/purchases": "http://localhost:5000",
//     },
//   },
//   build: {
//     outDir: "dist",
//     sourcemap: false,
//     chunkSizeWarningLimit: 1000,
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({

  plugins: [
    react()
  ],


  server: {
    port: 3000,

    proxy: {

      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      },

      "/auth": {
        target: "http://localhost:5000",
        changeOrigin: true
      },

      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true
      }

    }
  },


  build: {

    outDir: "dist",

    sourcemap: false,

    chunkSizeWarningLimit: 500,


    rollupOptions: {

      output: {

        manualChunks: {

          vendor: [
            "react",
            "react-dom",
            "react-router-dom",
            "axios"
          ],

          ui: [
            "bootstrap",
            "react-icons"
          ]

        }

      }

    }

  }

});