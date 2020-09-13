import * as uut from './syncUtils';
import {MOCKED_PARSED_OPTIONS, MOCKED_RAW_OPTIONS} from "./constants";

describe('Sync utils', () => {
  describe('parseOptions', () => {
    it('Should parse options', () => {
      const parsedOptions = uut.parseOptions(MOCKED_RAW_OPTIONS);
      expect(parsedOptions).toEqual(MOCKED_PARSED_OPTIONS);
    })
  });

  describe('shouldIncludeItem', () => {
    function testItem(item: string, shouldInclude: boolean) {
      expect(uut.shouldIncludeItemByDefault(item)).toBe(shouldInclude);
    }

    it('Should include items', () => {
      testItem('src', true);
      testItem('assets', true);
      testItem('index.js', true);
    });

    it('Should not include hidden files and folders', () => {
      testItem('.idea', false);
      testItem('.gitignore', false);
    });

    it('Should not include node_modules', () => {
      testItem('node_modules', false);
    });

    it('Should include strings folders', () => {
      testItem('strings', true);
      testItem('Strings', true);
      testItem('moduleStrings', true);
    });

    it('Should not include config files', () => {
      testItem('config.js', false);
      testItem('tsconfig.json', false);
      testItem('babel.config.json', false);
    });

    it('Should not include detox folder', () => {
      testItem('detox', false);
    });

    it('Should not include kompot folder', () => {
      testItem('kompot', false);
    });

    it('Should not include e2e folder', () => {
      testItem('e2e', false);
    });

    it('Should not include production-e2e folder', () => {
      testItem('production-e2e', false);
    });

    it('Should not include tests folder', () => {
      testItem('tests', false);
    });

    it('Should not include test folder', () => {
      testItem('test', false);
    });

    it('Should include package.json', () => {
      testItem('package.json', true);
    });

    it('Should include index file', () => {
      testItem('index.js', true);
      testItem('index.ts', true);
    });

    it('Should include app file', () => {
      ['app.js', 'app.ts', 'app.jsx', 'app.tsx', 'App.js', 'App.ts', 'App.jsx', 'App.tsx']
        .forEach((file) => testItem(file, true));
    });

    it('Should not include demo folders', () => {
      ['demo', 'moduleDemo', 'demoModule', 'Demo', 'DemoModule', 'ModuleDemo']
        .forEach((file) => testItem(file, false));
    })
  });
});
