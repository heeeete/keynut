import globals from 'globals';
import pluginJs from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import pluginReact from 'eslint-plugin-react';
import airbnbTsConfig from 'eslint-config-airbnb-typescript';
// import airbnbConfig from 'eslint-config-airbnb';
import prettierConfig from 'eslint-config-prettier';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          './tsconfig.base.json',
          './apps/web/tsconfig.json',
          './apps/admin/tsconfig.json',
          './packages/ui/tsconfig.json',
        ],
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: pluginReact,
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,
      ...airbnbTsConfig.rules,
      ...prettierConfig.rules,
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
