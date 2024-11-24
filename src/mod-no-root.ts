import {defaultOptions, schema} from './utils/options.ts'
import {RuleCreator} from '@typescript-eslint/utils/eslint-utils'
import type {Rule} from 'eslint'
import {Context, plugin} from './context/index.ts'
import {localImport} from './utils/local-import.ts'
export const RULE = 'mod-no-root'
export const rule = RuleCreator.withoutDocs({
  meta: {
    messages: {
      [RULE]: 'Cant import files at root of "{{ src }}" in "{{ modForChild }}"',
    },
    schema,
    type: 'problem',
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const ctx = new Context(context, plugin, RULE, defaultOptions)
    if (ctx.isTest() || ctx.isRoot()) return {}
    return localImport((node, filename) => {
      const ictx = ctx.import(filename)
      if (ictx.isRoot()) {
        context.report({
          messageId: RULE,
          node,
          data: ictx.data(),
        })
      }
    })
  },
}) as unknown as Rule.RuleModule
