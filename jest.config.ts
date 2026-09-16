import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  transform: {
    "\\.[jt]sx?$": ["babel-jest", { rootMode: "upward" }],
  },
  moduleNameMapper: {
    // "@/*" mirrors the tsconfig paths and the rollup alias.
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
