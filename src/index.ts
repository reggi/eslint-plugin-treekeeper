import type {ESLint, Linter, Rule} from 'eslint'
import {defaultOptions, type Options} from './utils/options.ts'
import {plugin} from './context/index.ts'

import * as dirNestLimit from './dir-nest-limit.ts'
import * as index4Index from './index-4-index.ts'
import * as indexImports from './imports-index.ts'
import * as utilsImports from './imports-utils.ts'
import * as strictIndex from './strict-index.ts'
import * as strictTests from './strict-tests.ts'
import * as strictUtils from './strict-utils.ts'
import * as modNoRoot from './mod-no-root.ts'
import * as unused from './unused.ts'

function wrap({rule, RULE}: {rule: Rule.RuleModule; RULE: string}) {
  return {
    rules: {
      [RULE]: rule,
    },
  }
}

function getRules(rules: {rule: Rule.RuleModule; RULE: string}[]): {[key: string]: Rule.RuleModule} {
  return Object.assign({}, ...rules.map(wrap).map(v => v.rules))
}

const createPluginReccomended = (plugin: string) => {
  return (...rawPlugins: {rule: Rule.RuleModule; RULE: string}[]) => {
    return (options: Partial<Options> = {}) => {
      const plugins = getRules(rawPlugins)
      const rules = Object.assign(
        {},
        ...rawPlugins.map(v => {
          return {
            [`${plugin}/${v.RULE}`]: 'error',
          }
        }),
      )
      const mergedOptions = {...defaultOptions, ...options}
      const {files, ignores} = mergedOptions
      return {
        files,
        ignores,
        plugins: {
          [plugin]: {
            rules: plugins,
          },
        },
        rules,
        settings: {
          [plugin]: mergedOptions,
        },
      } satisfies Linter.Config
    }
  }
}

const rules = [
  index4Index,
  dirNestLimit,
  indexImports,
  utilsImports,
  strictIndex,
  strictTests,
  strictUtils,
  unused,
  modNoRoot,
]

export const createRecommended = createPluginReccomended(plugin)
export const recommended = createRecommended(...rules)

const main = {
  rules: getRules(rules),
  configs: {
    recommended: recommended(defaultOptions),
  },
} satisfies ESLint.Plugin

export default main
