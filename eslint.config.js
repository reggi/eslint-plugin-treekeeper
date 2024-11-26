import eslintPluginImport from 'eslint-plugin-import'
import typescriptParser from '@typescript-eslint/parser'
import {recommended} from './dist/index.js'
import nodeSpecifier from 'eslint-plugin-node-specifier'

const shared = {
  files: ['**/*.ts', 'test/**/*.ts'],
  ignores: ['dist/**', 'ignore/**', 'coverage/**', 'examples/**'],
}

/** @type {import('eslint').Linter.Config[]} */
export default [
  recommended(shared),
  {
    ...shared,
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: 'tsconfig.json',
        createDefaultProgram: true,
      },
    },
    plugins: {
      import: eslintPluginImport,
      'node-specifier': nodeSpecifier,
    },
    rules: {
      'node-specifier/enforce-node-specifier': 'error',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
        },
      ],
    },
  },
]
