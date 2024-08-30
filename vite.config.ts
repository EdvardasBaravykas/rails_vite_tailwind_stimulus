import { defineConfig } from "vite";
import ViteRails from "vite-plugin-rails";

export default defineConfig({
  plugins: [ViteRails()],
  server: {
    hmr: {
      host: "localhost",
      port: 3036,
    },
  },
});
