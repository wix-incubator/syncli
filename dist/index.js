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
import * as path from 'path';
function getConfiguration(programOptions) {
    console.warn('RAW_CONFIGS', programOptions);
    var configs;
    if (programOptions.configuration) {
        configs = require(programOptions.configuration);
    }
    else if (programOptions.target) {
        var fileTypes = void 0;
        if (programOptions.fileTypes) {
            fileTypes = programOptions.fileTypes.split('/');
        }
        configs = {
            targets: [{
                    path: programOptions.target,
                    fileTypes: fileTypes
                }]
        };
    }
    return configs;
}
export function runCli(args) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var Command, program, configs, _loop_1, _i, _c, target;
        return __generator(this, function (_d) {
            console.warn('ARGS', args);
            Command = require('commander').Command;
            program = new Command();
            program
                .option('-c, --configuration <configuration>', 'json/js configuration file')
                .option('-t, --target <target>', 'target')
                .option('-f, --file-types <fileTypes>', 'file types')
                .parse(args);
            configs = getConfiguration(program.opts());
            console.log('CONFIGS', configs);
            if (configs === null || configs === void 0 ? void 0 : configs.targets) {
                _loop_1 = function (target) {
                    console.warn('TARGET', target);
                    var fileTypes = [];
                    (target.fileTypes || ['js', 'jsx', 'ts', 'tsx', 'json'])
                        .forEach(function (fileType) { return fileTypes.push("'**/*." + fileType + "'"); });
                    var sources = void 0;
                    if (target.sources) {
                        sources = target.sources.join('/');
                    }
                    console.warn('Running', __spreadArrays(['watchman-make', '-p'], fileTypes, ['--run', '"node', path.resolve(__dirname, './../sync.ts'), (_a = (sources && "--sources " + sources)) !== null && _a !== void 0 ? _a : '', '--target', target.path, '"']).join(' '));
                    console.warn('Running in', process.cwd());
                    try {
                        var spawn = require('child_process').spawn;
                        var watchman = spawn('watchman-make', __spreadArrays(['-p'], fileTypes, ['--run', "\"node " + path.resolve(__dirname, './../sync.ts') + " " + ((_b = (sources && "--sources " + sources)) !== null && _b !== void 0 ? _b : '') + " --target " + target.path + "\""]), { stdio: "inherit", shell: true });
                        watchman.on('close', function () {
                            console.warn('WATCHMAN CLOSE');
                        });
                        watchman.on('exit', function () {
                            console.warn('WATCHMAN EXIT');
                        });
                        console.warn('STARTED');
                    }
                    catch (e) {
                        console.warn('ERROR', e);
                    }
                };
                for (_i = 0, _c = configs.targets; _i < _c.length; _i++) {
                    target = _c[_i];
                    _loop_1(target);
                }
            }
            return [2 /*return*/];
        });
    });
}
