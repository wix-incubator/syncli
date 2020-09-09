"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOCKED_PARSED_OPTIONS = exports.MOCKED_RAW_OPTIONS = exports.DEFAULT_FILE_TYPES = exports.DEFAULT_IGNORE_SOURCES = void 0;
exports.DEFAULT_IGNORE_SOURCES = ['node_modules'];
exports.DEFAULT_FILE_TYPES = ['js', 'jsx', 'ts', 'tsx', 'json'];
/*** Mocks ***/
exports.MOCKED_RAW_OPTIONS = {
    target: 'some_path',
    ignoredSources: 'some_source/some_other_source',
    sources: 'src/assets/strings'
};
exports.MOCKED_PARSED_OPTIONS = {
    targetPath: 'some_path',
    ignoredSources: ['some_source', 'some_other_source'],
    sources: ['src', 'assets', 'strings'],
};
