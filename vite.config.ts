import { reactRouter } from "@react-router/dev/vite";
import { vercelPreset } from "@vercel/react-router/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter({
      presets: [vercelPreset()],
    }),
  ],
  css: {
    postcss: {},
  },
  resolve: {
    tsconfigPaths: true,
  },
});

