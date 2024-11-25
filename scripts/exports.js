#!/usr/bin/env node
import fs from 'fs'
import {globSync} from 'glob'
import packageJson from '../package.json' with {type: 'json'}
import path from 'path'

const files = globSync('./src/*.ts')
packageJson.exports = Object.fromEntries(
  files
    .map(file => {
      let key = file.replace('src/', '').replace('.ts', '')
      if (key === 'index') {
        key = '.'
      } else {
        key = `./${key}`
      }
      return [
        key,
        {
          import: `./${file.replace('src/', 'dist/').replace('.ts', '.js')}`,
          require: `./${file.replace('src/', 'dist/').replace('.ts', '.cjs')}`,
        },
      ]
    })
    .sort(([a], [b]) => a.localeCompare(b)),
)

fs.writeFileSync(path.join(process.cwd(), './package.json'), JSON.stringify(packageJson, null, 2))
