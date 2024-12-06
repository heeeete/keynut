import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact, { rules } from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: [
      'apps/**/*.{js,mjs,cjs,ts,jsx,tsx}',
      'packages/**/*.{js,mjs,cjs,ts,jsx,tsx}',
    ],
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      'react/react-in-jsx-scope': 'off', // React를 import하지 않아도 JSX 사용 가능
    },
  },
];
