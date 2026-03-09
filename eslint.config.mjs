import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next_build/**",
    ".next_dev/**",
    ".d/**",
    ".x/**",
    "backups/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "jest.config.js",
    "jest.setup.js",
    "test-connection.js",
  ]),
]);

export default eslintConfig;
