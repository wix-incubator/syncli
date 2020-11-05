import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import {LIST_ARGUMENT_SPLITTER} from './constants';

function prepareSources(sources: Sources): Sources {
  sources.forEach((source, index) => {
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

export function getItemsToSync(sources?: Sources, ignoredSources?: Sources) {
  sources = sources && prepareSources(sources);
  ignoredSources = ignoredSources && prepareSources(ignoredSources);
  let itemsToSync: Sources = sources || [];
  if (!itemsToSync || itemsToSync.length === 0) {
    itemsToSync = fs.readdirSync(path.resolve(process.cwd()));
    itemsToSync = itemsToSync?.filter((item) => {
      return ignoredSources && !ignoredSources.includes(item);
    });
  }

  return itemsToSync;
}

export function parseOptions(rawOptions: {[key: string]: string}): SyncOptions {
  const targetPath = rawOptions.target;
  const sources = rawOptions?.sources?.split(LIST_ARGUMENT_SPLITTER);
  const ignoredSources = rawOptions?.ignoredSources?.split(LIST_ARGUMENT_SPLITTER);
  return {targetPath, sources, ignoredSources};
}

export function logSummary(erroredItems: string[], itemsToSync: string[]) {
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
