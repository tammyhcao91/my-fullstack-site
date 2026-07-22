import { defineConfig } from "vite";

export default defineConfig({
  server: {
    // Respect a PORT assigned by the environment; fall back to Vite's default.
    port: Number(process.env.PORT) || 5173,
  },
});
