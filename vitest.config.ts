import { defineConfig, configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    // 프로젝트 테스트(tests/)만 수집한다. .claude(스킬 eval 산출물)·플러그인
    // 디렉터리의 *.test.ts 는 제외 — npm test / TDD 훅 노이즈 방지.
    exclude: [...configDefaults.exclude, "**/.claude/**", "vitest-tdd-plugin/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
});
