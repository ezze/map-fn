import { Linter } from 'eslint';
import ezzePrettier from 'eslint-config-ezze-prettier';
import ezzeTypeScript from 'eslint-config-ezze-ts';
import globals from 'globals';

const config: Array<Linter.Config> = [...ezzeTypeScript, ...ezzePrettier];

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
  ...config
];
