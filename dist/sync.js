"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var syncUtils_1 = require("./syncUtils");
var spawn = require('child_process').spawn;
var Command = require('commander').Command;
var chalk = require('chalk');
var program = new Command();
program
    .option('-s, --sources <sources>', 'sources to sync')
    .option('-i, --ignored-sources <ignoredSources>')
    .option('-t, --target <target>', 'target path')
    .parse(process.argv);
runSync(syncUtils_1.parseOptions(program.opts()));
function runSync(options) {
    var itemsToSync = syncUtils_1.getItemsToSync(options.sources, options.ignoredSources);
    var syncTarget = program.target;
    var finishedActions = 0;
    var erroredItems = [];
    if (itemsToSync && itemsToSync.length > 0 && syncTarget) {
        var _loop_1 = function (item) {
            var ls = spawn('rsync', ['-rtvi', item, syncTarget]);
            ls.stdout.on('data', function (data) {
                console.log(chalk.white('syncing... ' + chalk.green.bold(item)));
            });
            ls.stderr.on('data', function (data) {
                erroredItems.push(item);
                console.log(chalk.redBright(chalk.underline('Failed to sync') + " " + chalk.bold(item)));
                console.log(chalk.redBright('Error:'), '\n', data.toString(), '\n');
            });
            ls.on('close', function (code) {
                finishedActions++;
                if (finishedActions === itemsToSync.length) {
                    syncUtils_1.logSummary(erroredItems, itemsToSync);
                }
            });
        };
        for (var _i = 0, itemsToSync_1 = itemsToSync; _i < itemsToSync_1.length; _i++) {
            var item = itemsToSync_1[_i];
            _loop_1(item);
        }
    }
    else {
        console.log(chalk.redBright.bold('Error: Missing arguments'));
        console.log(chalk.redBright('Please check your configurations. Target and sources should not be empty.'));
        console.log(chalk.white("target: " + syncTarget));
        console.log(chalk.white("sources: " + itemsToSync));
        console.log('\n');
    }
}
