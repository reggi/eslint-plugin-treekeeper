import type {JSONSchema4} from '@typescript-eslint/utils/json-schema'

export type Options = {
  files: string[]
  ignores: string[]
  index: string
  utils: string
  src: string
  test: string
  limit: number
}

export const schema: JSONSchema4[] = [
  {
    type: 'object',
    properties: {
      files: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      ignores: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      index: {
        type: 'string',
        default: 'index',
      },
      utils: {
        type: 'string',
        default: 'utils',
      },
      src: {
        type: 'string',
        default: 'src',
      },
      test: {
        type: 'string',
        default: 'test',
      },
      limit: {
        type: 'number',
      },
    },
    additionalProperties: false,
  },
]

export const defaultOptions: Options = {
  files: ['src/**/*.ts', 'test/**/*.test.ts'],
  ignores: ['dist/**', 'coverage/**'],
  index: 'index',
  utils: 'utils',
  src: 'src',
  test: 'test',
  limit: 3,
}
