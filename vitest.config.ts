import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        ".nuxt/",
        "coverage/",
        "**/*.d.ts",
        "nuxt.config.ts",
        "tailwind.config.js",
      ],
    },
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./app"),
      "@": resolve(__dirname, "./app"),
    },
  },
});
