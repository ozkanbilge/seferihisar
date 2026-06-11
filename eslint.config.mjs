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
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/generated/**",
    "prisma/**",
  ]),
  {
    rules: {
      // localStorage/cookie gibi yalnızca istemcide bilinen değerlerin mount
      // anında state'e alınması SSR hidrasyonu için bilinçli bir kalıptır;
      // bu kural uyarıya indirildi.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
