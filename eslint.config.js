import eslintEzzePrettierConfig from 'eslint-config-ezze-prettier';
import eslintEzzeTypeScriptConfig from 'eslint-config-ezze-ts';
import globals from 'globals';

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  ...eslintEzzeTypeScriptConfig,
  ...eslintEzzePrettierConfig
];
