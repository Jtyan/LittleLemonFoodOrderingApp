// https://docs.expo.dev/guides/using-eslint/
import reactHooks from "eslint-plugin-react-hooks";
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  reactHooks.configs.flat.recommended,
]);
