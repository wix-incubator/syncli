"use strict";
var path = require('path');
var spawn = require('child_process').spawn;
var Command = require('commander').Command;
var fs = require('fs');
var chalk = require('chalk');
/*** Run Program ***/
var program = new Command();
program
    .option('-s, --sources <sources>', 'sources to sync')
    .option('-i, --ignore-sources <ignoreSources>')
    .option('-t, --target <target>', 'target path')
    .parse(process.argv);
runSync(parseOptions(program.opts()));
/*** Functions ***/
function parseOptions(rawOptions) {
    var _a, _b;
    var targetPath = rawOptions.target;
    var sources = (_a = rawOptions === null || rawOptions === void 0 ? void 0 : rawOptions.sources) === null || _a === void 0 ? void 0 : _a.split('/');
    var ignoreSources = (_b = rawOptions === null || rawOptions === void 0 ? void 0 : rawOptions.ignoreSources) === null || _b === void 0 ? void 0 : _b.split('/');
    return { targetPath: targetPath, sources: sources, ignoreSources: ignoreSources };
}
function getItemsToSync(sources, ignoreSources) {
    var itemsToSync = sources || [];
    if (!itemsToSync || itemsToSync.length === 0) {
        itemsToSync = fs.readdirSync(path.resolve(process.cwd()));
        itemsToSync = itemsToSync === null || itemsToSync === void 0 ? void 0 : itemsToSync.filter(function (item) {
            return !ignoreSources.includes(item);
        });
    }
    return itemsToSync;
}
function logSummary(erroredItems, itemsToSync) {
    if (erroredItems.length > 0) {
        var syncedItems = itemsToSync.filter(function (item) { return !erroredItems.includes(item); });
        erroredItems.forEach(function (item) {
            console.log(chalk.bgRedBright.whiteBright('Error'), item);
        });
        syncedItems.forEach(function (item) {
            console.log(chalk.bgGreenBright.blackBright('Synced'), item);
        });
    }
    else {
        console.log(chalk.bgGreenBright.blackBright('\n', ' ✔ All synced '));
    }
    console.log('\n', '---------------', '\n');
}
function runSync(options) {
    var itemsToSync = getItemsToSync(options.sources, options.ignoreSources);
    var syncTarget = program.target;
    var finishedActions = 0;
    var erroredItems = [];
    if (itemsToSync && syncTarget) {
        var _loop_1 = function (item) {
            var ls = spawn('rsync', ['-rtvi', item, syncTarget]);
            ls.stdout.on('data', function (data) {
                console.log(chalk.white('syncing -> ' + chalk.green.bold(item)));
            });
            ls.stderr.on('data', function (data) {
                erroredItems.push(item);
                console.log(chalk.redBright(chalk.underline('Failed to sync') + " " + chalk.bold(item)));
                console.log(chalk.redBright('Error:'), '\n', data.toString(), '\n');
            });
            ls.on('close', function (code) {
                finishedActions++;
                if (finishedActions === itemsToSync.length) {
                    logSummary(erroredItems, itemsToSync);
                }
            });
        };
        for (var _i = 0, itemsToSync_1 = itemsToSync; _i < itemsToSync_1.length; _i++) {
            var item = itemsToSync_1[_i];
            _loop_1(item);
        }
    }
    else {
        throw Error('missing arguments');
    }
}
