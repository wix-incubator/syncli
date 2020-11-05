export const DEFAULT_FILE_TYPES = ['js', 'jsx', 'ts', 'tsx', 'json'];
export const DEFAULT_IGNORED_SOURCES_DESCRIPTION = 'ignore all files/folders listed .npmignore and .gitignore (if exists)';

export const LIST_ARGUMENT_SPLITTER = ',';

/*** Mocks ***/

export const MOCKED_RAW_OPTIONS = {
  target: 'some_path',
  ignoredSources: 'node_modules,someFiles.json'
}

export const MOCKED_PARSED_OPTIONS = {
  targetPath: 'some_path',
  ignoredSources: ['node_modules','someFiles.json']
}
