import {defaultOptions, schema} from './utils/options.ts'
import {RuleCreator} from '@typescript-eslint/utils/eslint-utils'
import type {Rule} from 'eslint'
import {Context} from './context/index.ts'
import {Paths} from './paths/index.ts'

export const RULE = 'strict-index'
let cache: Paths | undefined

export const rule = RuleCreator.withoutDocs({
  meta: {
    messages: {
      [RULE]: `"{{ modForChild }}" in "{{ src }}" should have an "{{ indexFile }}" or move it to "{{ utils }}"`,
    },
    schema,
    type: 'problem',
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const ctx = new Context(context, 'reggi', RULE, defaultOptions)
    if (!cache) {
      cache = ctx.projectFiles()
    }
    if (!ctx.isModuleUtil()) return {}
    return {
      Program(node) {
        const path = cache?.isMissingIndex(context.filename)
        if (path) {
          context.report({
            node,
            messageId: RULE,
            data: path.data(),
          })
        }
      },
    }
  },
}) as unknown as Rule.RuleModule
