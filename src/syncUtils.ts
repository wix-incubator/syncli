import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import {DEFAULT_IGNORE_SOURCES} from './constants';

export function parseOptions(rawOptions: { [key: string]: string }): SyncOptions {
  const targetPath = rawOptions.target;
  const sources = rawOptions?.sources?.split('/');
  const ignoredSources = rawOptions?.ignoredSources?.split('/');
  return {targetPath, sources, ignoredSources};
}

export function shouldIncludeItemByDefault(item: string): boolean {
  const isIgnoredByDefault = DEFAULT_IGNORE_SOURCES.includes(item);
  const dotIndex = item.indexOf('.');
  const isHidden = dotIndex === 0;
  const lowerCaseItem = item.toLowerCase();
  const isFile = dotIndex > 0;
  const isAllowedFile = isFile && (['package.json', 'index.js', 'index.ts', 'app.js', 'app.ts', 'app.jsx', 'app.tsx'].includes(lowerCaseItem));
  const isTestRelated = lowerCaseItem.includes('test') || lowerCaseItem.includes('e2e');
  const isDemoRelated = lowerCaseItem.includes('demo');

  return !isIgnoredByDefault && !isHidden && !isTestRelated && !isDemoRelated && (isAllowedFile || !isFile);
}

export function getItemsToSync(sources?: Sources, ignoredSources?: Sources) {
  let itemsToSync: Sources = sources || [];
  if (!itemsToSync || itemsToSync.length === 0) {
    itemsToSync = fs.readdirSync(path.resolve(process.cwd()));
    itemsToSync = itemsToSync?.filter((item) => {
      if (ignoredSources) {
        return !ignoredSources.includes(item);
      }
      return shouldIncludeItemByDefault(item);
    });
  }

  return itemsToSync;
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
