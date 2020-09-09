import {getItemsToSync, logSummary, parseOptions} from './syncUtils';

const {spawn} = require('child_process');
const {Command} = require('commander');
const chalk = require('chalk');

const program = new Command();
program
  .option('-s, --sources <sources>', 'sources to sync')
  .option('-i, --ignored-sources <ignoredSources>')
  .option('-t, --target <target>', 'target path')
  .parse(process.argv);

runSync(parseOptions(program.opts()));

function runSync(options: SyncOptions) {
  const itemsToSync = getItemsToSync(options.sources, options.ignoredSources);
  const syncTarget = program.target;

  let finishedActions = 0;
  let erroredItems: Sources = [];
  if (itemsToSync && itemsToSync.length > 0 && syncTarget) {
    for (let item of itemsToSync) {
      const ls = spawn('rsync', ['-rtvi', item, syncTarget]);

      ls.stdout.on('data', (data: any) => {
        console.log(chalk.white('syncing -> ' + chalk.green.bold(item)));
      });

      ls.stderr.on('data', (data: any) => {
        erroredItems.push(item);
        console.log(chalk.redBright(`${chalk.underline('Failed to sync')} ${chalk.bold(item)}`));
        console.log(chalk.redBright('Error:'), '\n', data.toString(), '\n');
      });

      ls.on('close', (code: any) => {
        finishedActions++;
        if (finishedActions === itemsToSync.length) {
          logSummary(erroredItems, itemsToSync);
        }
      });
    }
  } else {
    console.log(chalk.redBright.bold('Error: Missing arguments'));
    console.log(chalk.redBright('Please check your configurations. Target and sources should not be empty.'));
    console.log(chalk.white(`target: ${syncTarget}`));
    console.log(chalk.white(`sources: ${itemsToSync}`));
    console.log('\n');
  }
}
