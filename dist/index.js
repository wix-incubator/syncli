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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCli = void 0;
var path = __importStar(require("path"));
var chalk_1 = __importDefault(require("chalk"));
var constants_1 = require("./constants");
var fs_1 = __importDefault(require("fs"));
var Actions;
(function (Actions) {
    Actions["TO"] = "to";
})(Actions || (Actions = {}));
function validateTarget(target) {
    var errorMessage;
    if (!target) {
        errorMessage = 'Missing configurations';
    }
    else if (!target.path) {
        errorMessage = 'Missing target path';
    }
    if (errorMessage) {
        console.log(chalk_1.default.redBright.bold(chalk_1.default.underline('Error'), '\n', errorMessage));
        console.log(chalk_1.default.whiteBright("configurations: " + target));
    }
    return !errorMessage;
}
function searchModuleAbsolutePath(moduleName) {
    var moduleAbsolutePath;
    if (moduleName) {
        var parentDirPath = path.resolve(process.cwd(), '../');
        for (var parentDirsAmount = 0; parentDirsAmount < 2; parentDirsAmount++) {
            var parentDirItems = fs_1.default.readdirSync(parentDirPath);
            if (parentDirItems) {
                for (var _i = 0, parentDirItems_1 = parentDirItems; _i < parentDirItems_1.length; _i++) {
                    var item = parentDirItems_1[_i];
                    if (item === moduleName) {
                        moduleAbsolutePath = path.resolve(parentDirPath, item);
                        break;
                    }
                }
            }
            if (moduleAbsolutePath) {
                break;
            }
            parentDirPath = path.resolve(parentDirPath, '../');
        }
    }
    return moduleAbsolutePath;
}
function parseTargetPath(rawPath) {
    var resolvedPath = '';
    if (rawPath) {
        if (rawPath.includes('/') || rawPath.includes('.')) {
            resolvedPath = path.resolve(rawPath);
        }
        else {
            var modulePath = searchModuleAbsolutePath(rawPath);
            if (modulePath) {
                var originModuleName = path.basename(process.cwd());
                resolvedPath = path.resolve(modulePath, 'node_modules', originModuleName);
            }
        }
    }
    return resolvedPath;
}
function getConfiguration(targetPath, programOptions) {
    var _a, _b;
    var configs;
    var fileTypes;
    if (programOptions.fileTypes) {
        fileTypes = programOptions.fileTypes.split('/');
    }
    var sources = (_a = programOptions.sources) === null || _a === void 0 ? void 0 : _a.split('/');
    var ignoredSources = (_b = programOptions.ignoredSources) === null || _b === void 0 ? void 0 : _b.split('/');
    configs = {
        target: {
            path: parseTargetPath(targetPath),
            fileTypes: fileTypes,
            sources: sources,
            ignoredSources: ignoredSources
        }
    };
    return configs;
}
function printConfigurations(target) {
    console.log(chalk_1.default.blueBright(chalk_1.default.bold('Target path:'), target.path));
    console.log(chalk_1.default.blueBright(chalk_1.default.bold('Sources:'), target.sources || 'Default (All)'));
    if (!target.sources) {
        console.log(chalk_1.default.blueBright(chalk_1.default.bold('Ignored sources:'), target.ignoredSources || "Default -\n" + constants_1.DEFAULT_IGNORED_SOURCES_DESCRIPTION));
    }
    console.log(chalk_1.default.blueBright(chalk_1.default.bold('File types:'), target.fileTypes || "Default (" + constants_1.DEFAULT_FILE_TYPES + ")"));
}
function getSyncScriptCommand(target) {
    var _a, _b;
    var targetPath = target.path;
    var scriptPath = path.resolve(__dirname, './sync.js');
    var sources = (_a = (target.sources && "--sources " + target.sources)) !== null && _a !== void 0 ? _a : '';
    var ignoredSources = (_b = (target.ignoredSources && "--ignored-sources " + target.ignoredSources)) !== null && _b !== void 0 ? _b : '';
    return "\"node " + scriptPath + " " + sources + " " + ignoredSources + " --target " + targetPath + "\"";
}
function runCli(args) {
    return __awaiter(this, void 0, void 0, function () {
        var spawn, Command, program;
        return __generator(this, function (_a) {
            spawn = require('child_process').spawn;
            Command = require('commander').Command;
            program = new Command();
            program
                .arguments('<command> [targetPath]')
                .usage('to <target-path> [options]')
                .option('-f, --file-types <fileTypes>', "File types that will be synced.\nSplit by '/'.\nExample: ts/jsx/xml")
                .option('-s, --sources <sources>', "Files/folders from the root folder that will be synced.\nSplit by '/'.\nExample: src/strings/someFile.js\nThe default is all.")
                .option('-i, --ignored-sources <ignoredSources>', "Files/folders from the root folder that will NOT be synced.\nSplit by '/'.\nExample: node_modules/someIgnoredFile.json\nThe default is:\n" + constants_1.DEFAULT_IGNORED_SOURCES_DESCRIPTION)
                .action(function (command, targetPath) {
                var _a;
                if (command === Actions.TO) {
                    var target = (_a = getConfiguration(targetPath, program.opts())) === null || _a === void 0 ? void 0 : _a.target;
                    if (validateTarget(target)) {
                        printConfigurations(target);
                        var fileTypes_1 = [];
                        (target.fileTypes || constants_1.DEFAULT_FILE_TYPES)
                            .forEach(function (fileType) { return fileTypes_1.push("'**/*." + fileType + "'"); });
                        var watchmanCommand = 'watchman-make';
                        var watchmanArgs = __spreadArrays(['-p'], fileTypes_1, ['--run', getSyncScriptCommand(target)]);
                        console.log(chalk_1.default.green.bold('Running'), watchmanCommand, watchmanArgs.join(' '));
                        spawn(watchmanCommand, watchmanArgs, { stdio: "inherit", shell: true });
                    }
                }
            })
                .parse(args);
            return [2 /*return*/];
        });
    });
}
exports.runCli = runCli;
