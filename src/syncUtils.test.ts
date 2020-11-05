import * as uut from './syncUtils';
import {MOCKED_PARSED_OPTIONS, MOCKED_RAW_OPTIONS} from "./constants";

describe('Sync utils', () => {
  describe('parseOptions', () => {
    it('Should parse options', () => {
      const parsedOptions = uut.parseOptions(MOCKED_RAW_OPTIONS);
      expect(parsedOptions).toEqual(MOCKED_PARSED_OPTIONS);
    })
  });
});
