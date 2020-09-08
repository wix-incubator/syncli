const path = require('path');
const {spawn} = require('child_process');
const {Command} = require('commander');
const fs = require('fs');
const chalk = require('chalk');

/*** Declarations ***/

type Sources = string[];

interface Options {
  targetPath?: string;
  sources?: Sources;
  ignoreSources?: Sources;
}

/*** Run Program ***/

const program = new Command();
program
  .option('-s, --sources <sources>', 'sources to sync')
  .option('-i, --ignore-sources <ignoreSources>')
  .option('-t, --target <target>', 'target path')
  .parse(process.argv);

runSync(parseOptions(program.opts()));

/*** Functions ***/

function parseOptions(rawOptions: { [key: string]: string }): Options {
  const targetPath = rawOptions.target;
  const sources = rawOptions?.sources?.split('/');
  const ignoreSources = rawOptions?.ignoreSources?.split('/');
  return {targetPath, sources, ignoreSources};
}

function getItemsToSync(sources?: Sources, ignoreSources?: Sources) {
  let itemsToSync: Sources = sources || [];
  if (!itemsToSync || itemsToSync.length === 0) {
    itemsToSync = fs.readdirSync(path.resolve(process.cwd()));
    itemsToSync = itemsToSync?.filter((item) => {
      return !ignoreSources!.includes(item);
    });
  }

  return itemsToSync;
}

function logSummary(erroredItems: string[], itemsToSync: string[]) {
  if (erroredItems.length > 0) {
    const syncedItems = itemsToSync.filter((item) => !erroredItems.includes(item));
    erroredItems.forEach((item) => {
      console.log(chalk.bgRedBright.whiteBright('Error'), item);
    });
    syncedItems.forEach((item) => {
      console.log(chalk.bgGreenBright.blackBright('Synced'), item);
    });
  } else {
    console.log(chalk.bgGreenBright.blackBright('\n', ' ✔ All synced '));
  }
  console.log('\n', '---------------', '\n');
}

function runSync(options: Options) {
  const itemsToSync = getItemsToSync(options.sources, options.ignoreSources);
  const syncTarget = program.target;

  let finishedActions = 0;
  let erroredItems: Sources = [];
  if (itemsToSync && syncTarget) {
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
    throw Error('missing arguments');
  }
}
