
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { componentTagger } from "lovable-tagger";

// export default defineConfig(({ mode }) => ({
//   base: "/",
//   server: {
//     host: "::",
//     port: 8080,
//   },
//   build: {
//     outDir: "dist", // ✅ this matches Render's publish directory
//   },
//   plugins: [react(), mode === "development" && componentTagger()].filter(
//     Boolean
//   ),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// }));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    base: isDev
      ? "/" // development server
      : process.env.VITE_API_BASE || "/", // production served via Nginx

    server: {
      host: isDev ? "localhost" : "0.0.0.0",
      port: isDev ? 8080 : 80,
    },

    build: {
      outDir: "dist",
      // optional: ensure assets use relative paths for Nginx
      assetsDir: "assets",
    },

    plugins: [react(), isDev && componentTagger()].filter(Boolean),

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    optimizeDeps: {
      include: ["date-fns"], 
    },
  };
});
