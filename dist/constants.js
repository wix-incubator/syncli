"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOCKED_PARSED_OPTIONS = exports.MOCKED_RAW_OPTIONS = exports.LIST_ARGUMENT_SPLITTER = exports.DEFAULT_IGNORED_SOURCES_DESCRIPTION = exports.DEFAULT_FILE_TYPES = void 0;
exports.DEFAULT_FILE_TYPES = ['js', 'jsx', 'ts', 'tsx', 'json'];
exports.DEFAULT_IGNORED_SOURCES_DESCRIPTION = 'ignore all files/folders listed .npmignore and .gitignore (if exists)';
exports.LIST_ARGUMENT_SPLITTER = ',';
/*** Mocks ***/
exports.MOCKED_RAW_OPTIONS = {
    target: 'some_path',
    ignoredSources: 'node_modules,someFiles.json'
};
exports.MOCKED_PARSED_OPTIONS = {
    targetPath: 'some_path',
    ignoredSources: ['node_modules', 'someFiles.json']
};
