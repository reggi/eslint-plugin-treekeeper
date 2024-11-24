import {defaultOptions, schema} from './utils/options.ts'
import {RuleCreator} from '@typescript-eslint/utils/eslint-utils'
import type {Rule} from 'eslint'
import {Context, plugin} from './context/index.ts'
import {localImport} from './utils/local-import.ts'

export const RULE = 'imports-index'
export const rule = RuleCreator.withoutDocs({
  meta: {
    messages: {
      [RULE]:
        'Can\'t import across modules, "{{ relativeChild }}" used in at least 2 places {{ modPlaces }}, moved it to "{{ utils }}".',
    },
    schema,
    type: 'problem',
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const ctx = new Context(context, plugin, RULE, defaultOptions)
    if (!ctx.isModuleIndex()) return {}
    return localImport((node, filename) => {
      const ictx = ctx.import(filename)
      if (!ictx.isValidModuleIndexImport()) {
        context.report({
          messageId: RULE,
          node,
          data: ictx.data(),
        })
      }
    })
  },
}) as unknown as Rule.RuleModule
