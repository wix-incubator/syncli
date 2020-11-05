"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSummary = exports.parseOptions = exports.getItemsToSync = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
var constants_1 = require("./constants");
function prepareSources(sources) {
    sources.forEach(function (source, index) {
        if (source.startsWith('/')) {
            source = source.substring(1);
        }
        if (source.endsWith('/')) {
            source = source.substring(0, source.length - 1);
        }
        sources[index] = source;
    });
    return sources;
}
function getItemsToSync(sources, ignoredSources) {
    sources = sources && prepareSources(sources);
    ignoredSources = ignoredSources && prepareSources(ignoredSources);
    var itemsToSync = sources || [];
    if (!itemsToSync || itemsToSync.length === 0) {
        itemsToSync = fs_1.default.readdirSync(path_1.default.resolve(process.cwd()));
        itemsToSync = itemsToSync === null || itemsToSync === void 0 ? void 0 : itemsToSync.filter(function (item) {
            return ignoredSources && !ignoredSources.includes(item);
        });
    }
    return itemsToSync;
}
exports.getItemsToSync = getItemsToSync;
function parseOptions(rawOptions) {
    var _a, _b;
    var targetPath = rawOptions.target;
    var sources = (_a = rawOptions === null || rawOptions === void 0 ? void 0 : rawOptions.sources) === null || _a === void 0 ? void 0 : _a.split(constants_1.LIST_ARGUMENT_SPLITTER);
    var ignoredSources = (_b = rawOptions === null || rawOptions === void 0 ? void 0 : rawOptions.ignoredSources) === null || _b === void 0 ? void 0 : _b.split(constants_1.LIST_ARGUMENT_SPLITTER);
    return { targetPath: targetPath, sources: sources, ignoredSources: ignoredSources };
}
exports.parseOptions = parseOptions;
function logSummary(erroredItems, itemsToSync) {
    if (erroredItems.length > 0) {
        var syncedItems = itemsToSync.filter(function (item) { return !erroredItems.includes(item); });
        erroredItems.forEach(function (item) {
            console.log(chalk_1.default.bgRedBright.whiteBright('Error'), item);
        });
        syncedItems.forEach(function (item) {
            console.log(chalk_1.default.bgGreenBright.blackBright('Synced'), item);
        });
    }
    else {
        console.log(chalk_1.default.bgGreenBright.blackBright('\n', ' ✔ All synced '));
    }
    console.log('\n', '---------------', '\n');
}
exports.logSummary = logSummary;
