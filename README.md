# syncli
CLI tool for syncing between modules locally. Working on cross-modules feature is now easier than ever.

### Installation
1. Syncli uses `watchman-make` and it requires `pywatchman` (and thus requires `python`) as well as `watchman`.

2. `npm install syncli -g` / `npx syncli`
### Usage
`syncli to <target path> [options]`

##### Target path
Can be:
1. Absolute path
2. Relative path
3. Only module name. Will work if the module exists in up to 2 parent folders of the running folder. The path will be the absolute path of the founded module folder + `/node_modules/<running-dir-name>`.
