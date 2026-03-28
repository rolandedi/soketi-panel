import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup.ts"],

    // Include test files
    include: ["test/**/*.test.{ts,js}"],

    // Exclude patterns
    exclude: [
      "**/node_modules/**",
      "**/.nuxt/**",
      "**/dist/**",
      "**/playwright/**",
      "**/e2e/**",
    ],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["server/**/*.{ts,js}", "app/**/*.{ts,vue}"],
      exclude: [
        "test/**",
        "**/node_modules/**",
        "**/.nuxt/**",
        "**/dist/**",
        "**/*.d.ts",
        "**/*.config.ts",
      ],
    },
  },
});
