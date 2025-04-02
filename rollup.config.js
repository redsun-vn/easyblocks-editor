// @ts-check
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import packageJson from "./package.json";
import alias from "@rollup/plugin-alias";
import path from "node:path";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

function getPlugins(format) {
  /**
   * @type import('rollup').RollupOptions['plugins']
   */
  const plugins = [
    babel({
      configFile: "./.babelrc.json",
      extensions,
      exclude: [/node_modules/],
      babelHelpers: "runtime",
    }),

    nodeResolve({
      extensions,
      browser: format === "es",
    }),

    commonjs({}),

    json(),
  ];

  return plugins;
}

/**
 * @type import('rollup').RollupOptions
 */
const baseConfig = {
  input: "./src/index.ts",
  external: [
    ...Object.keys(packageJson.peerDependencies),
    ...Object.keys(packageJson.dependencies),
    /@babel\/runtime/,
    /lodash/,
    /react-dom/,
    /@easyblocks\/core/,
  ],
};

/**
 * @type import('rollup').RollupOptions
 */
const configEs = {
  ...baseConfig,
  output: {
    format: "es",
    dir: "./dist/es",
    banner: `"use client";`,
  },
  plugins: [
    ...getPlugins("es"),
    alias({
      entries: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    }),
  ],
};

/**
 * @type import('rollup').RollupOptions
 */
const configCjs = {
  ...baseConfig,
  output: {
    format: "cjs",
    dir: "./dist/cjs",
    banner: `"use client";`,
    entryFileNames: "[name].cjs",
  },
  plugins: [
    ...getPlugins("cjs"),
    alias({
      entries: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    }),
  ],
};

export default [configEs, configCjs];
