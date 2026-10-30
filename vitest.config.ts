import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  test: {
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.ts", "supabase/functions/**/*.test.ts"],
    exclude: ["node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/lib/**/*.ts", "supabase/functions/**/lib.ts"],
      exclude: ["**/*.test.ts", "src/lib/supabase/**", "src/lib/admin.ts", "src/lib/content.ts", "src/lib/utils.ts"],
    },
  },
});
