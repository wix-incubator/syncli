export const DEFAULT_IGNORE_SOURCES = ['node_modules'];
export const DEFAULT_FILE_TYPES = ['js', 'jsx', 'ts', 'tsx', 'json'];

/*** Mocks ***/

export const MOCKED_RAW_OPTIONS = {
  target: 'some_path',
  ignoredSources: 'some_source/some_other_source',
  sources: 'src/assets/strings'
}

export const MOCKED_PARSED_OPTIONS = {
  targetPath: 'some_path',
  ignoredSources: ['some_source', 'some_other_source'],
  sources: ['src', 'assets', 'strings'],
}
