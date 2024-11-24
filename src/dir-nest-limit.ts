import {defaultOptions, Options, schema} from './utils/options.ts'
import {RuleCreator} from '@typescript-eslint/utils/eslint-utils'
import type {Rule} from 'eslint'
import {Context, plugin} from './context/index.ts'

export const RULE = 'dir-nest-limit'
export const rule = RuleCreator.withoutDocs({
  meta: {
    messages: {
      [RULE]: 'Only nest files files up to {{ limit }} directories deep, {{ depth }} exceeds by {{ depthOver }}',
    },
    schema,
    type: 'problem',
  },
  defaultOptions: [defaultOptions],
  create(context) {
    return {
      Program(node) {
        const ctx = new Context(context, plugin, RULE, defaultOptions)
        if (ctx.length > ctx.options.limit) {
          context.report({
            messageId: RULE,
            node,
            data: ctx.data(),
          })
        }
      },
    }
  },
}) as unknown as Rule.RuleModule
