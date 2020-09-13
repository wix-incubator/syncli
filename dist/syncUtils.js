"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSummary = exports.getItemsToSync = exports.shouldIncludeItemByDefault = exports.parseOptions = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
var constants_1 = require("./constants");
function parseOptions(rawOptions) {
    var _a, _b;
    var targetPath = rawOptions.target;
    var sources = (_a = rawOptions === null || rawOptions === void 0 ? void 0 : rawOptions.sources) === null || _a === void 0 ? void 0 : _a.split('/');
    var ignoredSources = (_b = rawOptions === null || rawOptions === void 0 ? void 0 : rawOptions.ignoredSources) === null || _b === void 0 ? void 0 : _b.split('/');
    return { targetPath: targetPath, sources: sources, ignoredSources: ignoredSources };
}
exports.parseOptions = parseOptions;
function shouldIncludeItemByDefault(item) {
    var isIgnoredByDefault = constants_1.DEFAULT_IGNORE_SOURCES.includes(item);
    var dotIndex = item.indexOf('.');
    var isHidden = dotIndex === 0;
    var lowerCaseItem = item.toLowerCase();
    var isFile = dotIndex > 0;
    var isAllowedFile = isFile && (['package.json', 'index.js', 'index.ts', 'app.js', 'app.ts', 'app.jsx', 'app.tsx'].includes(lowerCaseItem));
    var isTestRelated = lowerCaseItem.includes('test') || lowerCaseItem.includes('e2e');
    var isDemoRelated = lowerCaseItem.includes('demo');
    return !isIgnoredByDefault && !isHidden && !isTestRelated && !isDemoRelated && (isAllowedFile || !isFile);
}
exports.shouldIncludeItemByDefault = shouldIncludeItemByDefault;
function getItemsToSync(sources, ignoredSources) {
    var itemsToSync = sources || [];
    if (!itemsToSync || itemsToSync.length === 0) {
        itemsToSync = fs_1.default.readdirSync(path_1.default.resolve(process.cwd()));
        itemsToSync = itemsToSync === null || itemsToSync === void 0 ? void 0 : itemsToSync.filter(function (item) {
            if (ignoredSources) {
                return !ignoredSources.includes(item);
            }
            return shouldIncludeItemByDefault(item);
        });
    }
    return itemsToSync;
}
exports.getItemsToSync = getItemsToSync;
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
