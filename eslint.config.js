import eslintPluginImport from 'eslint-plugin-import'
import typescriptParser from '@typescript-eslint/parser'
import {recommended} from './dist/index.js'

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
    },
    rules: {
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
