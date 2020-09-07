const {spawn} = require('child_process');
const {Command} = require('commander');
const fs = require('fs');

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
  .option('-is, --ignore-sources <ignoreSources>')
  .option('-t, --target <target>', 'target path')
  .parse(process.argv);

runSync(parseOptions(program.opts()));

/*** Functions ***/

function parseOptions(rawOptions: { [key: string]: string }): Options {
  const targetPath = rawOptions.target;
  const sources = rawOptions.sources.split('/');
  const ignoreSources = rawOptions.ignoreSources.split('/');
  return {targetPath, sources, ignoreSources};
}

function getItemsToSync(userSources?: Sources) {
  let itemsToSync = userSources;

  if (!itemsToSync || itemsToSync.length === 0) {
    itemsToSync = fs.readdirSync(__dirname);
  }

  return itemsToSync;
}

function runSync(options: Options) {
  const itemsToSync = getItemsToSync(options.sources || options.ignoreSources);
  const syncTarget = program.target;
  console.warn('ITEMS TO SYNC', itemsToSync);

  if (itemsToSync && syncTarget) {
    for (let item of itemsToSync) {
      console.warn('ITEM', item);
      const ls = spawn('rsync', ['-rtvi', item, syncTarget]);

      ls.stdout.on('data', (data: any) => {
        console.log(data);
      });

      ls.stderr.on('data', (data: any) => {
        console.error(`STDERR: ${data}`);
      });

      ls.on('close', (code: any) => {
        console.log(`child process exited with code ${code}`);
      });
    }
  } else {
    throw Error('missing arguments');
  }
}
