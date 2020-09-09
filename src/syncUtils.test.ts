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
  });
});
