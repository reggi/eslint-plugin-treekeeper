# eslint-plugin-treekeeper

I'm obsessed with how we organize code. I've made many attempts at coming up with a "best practice" when it comes to organizing a javascript / typescript project (see some links below). Last year I worked on a project called "Tree Lint" which built up a dependency map of all your local files and would be opinionated about where they should live relative to each other, the idea was if I authored code in just the right way, it would be easy to break a "branch" of the dir structure into it's own package. In practice this created a very deeply nested structure. This takes from some of the learnings from that original project and expands on them with a different set of rules and relations, and favors a shallow or flat folder structure.

## How does it work?

At a hight level:

- Modules are self-contained units with their own utilities and main entry point.
- Utility files are simple and independent.
- Index files act as the only points of interaction between modules.
- Shared utilities are centralized in a common folder for reuse across modules.
- Root-level files are isolated from modules and handle top-level functionality.

```
src/
├── foo/
│   ├── index.ts   // Module foo's main file
│   ├── alpha.ts   // Utility file for foo
│   └── beta.ts
├── bar/
│   ├── index.ts   // Module bar's main file
│   ├── gamma.ts   // Utility file for bar
│   └── delta.ts
├── utils/         // Shared utilities which can be imported by any index
│   ├── sigma.ts
│   └── omega.ts
├── index.ts       // Root-level file
└── bin.ts
```

- The `src` folder contains one level of subfolders; each subfolder is a **module**.
- Each module must contain an `index.ts` file.
- Modules must not contain any directories.
- The module's `index.ts` serves as the main entry point of its module.
- A module's `index.ts` can import its own module's utility files.
- A module's `index.ts` can import other modules' `index.ts` files.
- A module's `index.ts` can import files from the shared `utils` folder.
- A module's `index.ts` cannot import utility files from other modules.
- A module's `index.ts` cannot import root-level files.
- Any file in a module that is not `index.ts` is considered a utility file.
- Utility files cannot import any local files.
- Only their own module's `index.ts` can import utility files.
- Files directly under `src` (not inside any module) are called root-level files.
- Root-level files can import other root-level files.
- Root-level files cannot be imported by modules.
- The shared `utils` folder is located at the root of `src`.
- The `utils` folder contains utility files needed by two or more `index.ts` files.
- Files in the shared `utils` folder are accessible to all modules' `index.ts` files.
- Any file within the `test` directory is considered a test file.
- All test files must have a parallel file with the same basename in `src`.

## Plugins

| name                   | description                                                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| dir-nest-limit         | Enforces a limit on the number of nested directories within a project.                                               |
| enforce-has-index      | Requires every module to include an index file.                                                                      |
| enforce-test-in-src    | Ensures each test file has a corresponding source file in the 'src' directory.                                       |
| no-root-import         | Prevents modules from importing files at the root level.                                                             |
| suggest-move-in-utils  | Checks for files being imported from multiple directories and suggests moving them to an agnostic "utils" directory. |
| suggest-move-out-utils | Requires utils used by only one module to be relocated to that module.                                               |
| unused                 | Lists all unused files in the project.                                                                               |
| utils-no-import-index  | Prevents importing index for utils files.                                                                            |
| utils-no-import        | Prevents local imports for utils files.                                                                              |

## Options

| name    | type     | description                                        | default                               |
| ------- | -------- | -------------------------------------------------- | ------------------------------------- |
| files   | string[] | An array of file paths to include.                 | `["src/**/*.ts","test/**/*.test.ts"]` |
| ignores | string[] | An array of file paths to ignore.                  | `["dist/**","coverage/**"]`           |
| index   | string   | The name of the "index" file                       | index                                 |
| utils   | string   | The name of the shared "utils" directory in "src". | utils                                 |
| src     | string   | The name of the "src" directory.                   | src                                   |
| test    | string   | The name of the "test" directory.                  | test                                  |
| limit   | number   | The dir nest limit.                                | 3                                     |

## A La Carte Plugin Pick

If you prefer to include only specific rules from the `eslint-plugin-treekeeper` plugin, you can do so by configuring them individually in your ESLint configuration file.

Example:

```js
// eslint.config.js
import {reccomended} from 'eslint-plugin-treekeeper'

export default [reccomended({})]
```

```js
// eslint.config.js
import {createRecommended} from 'eslint-plugin-treekeeper'
import plugin from 'eslint-plugin-treekeeper/dir-nest-limit'
const reccomended = createRecommended(plugin)

export default [reccomended()]
```

## Learnings

- eslint doesn't work well at a project level. (It's designed to be lint files and not their relationship to other files.)
- plugins have no way of running a handler when eslint is finished
- eslint's plugin system is synchoronous

I really wanted a way to have a plugin do stuff it wasn't supposed to do, like the `unused` plugin. The only way for this to work was to use the same glob pattern in the `eslint.config.js` and get a count of all the files, and have the plugin also get it's own count, and when they both equal each other then eslint is on it's last file. This is a real pain.

On top of this I also do ast parsing with typescript on the first plugin invocation, that way I have a structure to compare individual files to. I think this this is all pretty neat hackery for getting eslint plugin to do things it really wasnt designed for.

## Prior Art:

- [I invented a CLI tool to organize my typescript projects.](https://dev.to/reggi/i-invented-a-cli-tool-to-organize-my-typescript-projects-1j82)
- [In Defense of Having All Code in a Single File.](https://dev.to/reggi/in-defense-of-having-all-code-in-a-single-file-18lb)
- [tree_lint](https://github.com/reggi/tree_lint) / [tree_lint2](https://github.com/reggi/tree_lint2)
