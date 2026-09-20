// jsdom ships no TextEncoder/TextDecoder, and the compiler hashes styles with
// `js-xxhash`, which needs them. Imported from "util" rather than "node:util"
// because jest's resolver reads the prefixed form as a path.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { TextEncoder, TextDecoder } = require("util");

if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = TextEncoder;
}

if (typeof globalThis.TextDecoder === "undefined") {
  globalThis.TextDecoder = TextDecoder;
}
