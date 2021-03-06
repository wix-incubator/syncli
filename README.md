![](logo.png)

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

##### Options
* `-f` | `--files`
    * File types that will be synced
        * Split by ','
        * Example: `ts,jsx,xml`
* `-s` | `--sources`
    * Files/folders from the root folder that will be synced
        * Split by ','
        * Example: `src,strings,someFile.js`
* `-i` | `--ignored-sources`
    * Files/folders from the root folder that will NOT be synced
        * Split by ','.
        * Example: `node_modules,someIgnoredFile.json`
        * Default
            1. Hidden files/folders
            2. Files includes *config* (case-insensitive)
            3. All files except `package.json`, `index.t/js`, `app.t/js/x`
            4. Folders that includes *demo* (case-insensitive)
            5. `node_modules`, `build`, `artifacts`, `engine_autogenerated`, `e2e`, `production-e2e`, `kompot`, `detox`, `coverage`)
