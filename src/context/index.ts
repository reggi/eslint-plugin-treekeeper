import path from 'node:path'
import {Path} from '../path/index.ts'
import {type Options} from '../utils/options.ts'
import {Paths} from '../paths/index.ts'

export const plugin = 'reggi'

export class Context extends Path {
  filename: string
  options: Options
  indexFile: string
  constructor(
    context: {filename: string; settings?: Record<string, any>; cwd: string; options: any[]},
    public plugin: string,
    public rule: string,
    public defaultOptions: Options,
  ) {
    const filename = context.filename
    const cwd = context.cwd
    const ext = path.extname(filename)
    const pluginSettings = context?.settings?.[`${plugin}`] || {}
    const ruleSettings = context?.settings?.[`${plugin}/${rule}`] || {}
    const userOptions = Object.assign({}, ...context.options)
    const options = {...defaultOptions, ...pluginSettings, ...ruleSettings, ...userOptions}
    super({filename, options, cwd, ext})
    this.filename = filename
    this.options = options
    this.indexFile = options.index + ext
  }
  projectFiles() {
    return Paths.fromSync({options: this.options, ext: this.ext, cwd: this.cwd, parent: this})
  }
  dependencyMap() {
    return this.projectFiles().addDependencyMapInfo()
  }
  filesWithContent() {
    return this.projectFiles().addDependencyMapInfo().addFileContentInfo()
  }
}
