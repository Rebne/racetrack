import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  { 
    languageOptions: { 
      globals: globals.browser,
      ecmaVersion: 12,
      sorceType: "module",
    } },
  pluginJs.configs.recommended,
];