"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var uut = __importStar(require("./syncUtils"));
var constants_1 = require("./constants");
describe('Sync utils', function () {
    describe('parseOptions', function () {
        it('Should parse options', function () {
            var parsedOptions = uut.parseOptions(constants_1.MOCKED_RAW_OPTIONS);
            expect(parsedOptions).toEqual(constants_1.MOCKED_PARSED_OPTIONS);
        });
    });
    describe('shouldIncludeItem', function () {
        function testItem(item, shouldInclude) {
            expect(uut.shouldIncludeItemByDefault(item)).toBe(shouldInclude);
        }
        it('Should include items', function () {
            testItem('src', true);
            testItem('assets', true);
            testItem('index.js', true);
        });
        it('Should not include hidden files and folders', function () {
            testItem('.idea', false);
            testItem('.gitignore', false);
        });
        it('Should not include node_modules', function () {
            testItem('node_modules', false);
        });
    });
});
