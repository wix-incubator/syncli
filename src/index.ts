import * as path from 'path';
import chalk from 'chalk';
import {DEFAULT_FILE_TYPES} from "./constants";
import fs from 'fs';

function validateTarget(target: Target | undefined): boolean {
  let errorMessage;
  if (!target) {
    errorMessage = 'Missing configurations';
  } else if (!target.path) {
    errorMessage = 'Missing target path';
  }
  if (errorMessage) {
    console.log(chalk.redBright.bold(chalk.underline('Error'), '\n', errorMessage));
    console.log(chalk.whiteBright(`configurations: ${target}`));
  }
  return !errorMessage;
}

function searchModuleAbsolutePath(moduleName: string): string | undefined {
  let moduleAbsolutePath;

  if (moduleName) {
    let parentDirPath = path.resolve(process.cwd(), '../');
    for (let parentDirsAmount = 0; parentDirsAmount < 2; parentDirsAmount++) {
      const parentDirItems = fs.readdirSync(parentDirPath);
      if (parentDirItems) {
        for (const item of parentDirItems) {
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

  console.log('MODULE PATH', moduleAbsolutePath);
  return moduleAbsolutePath;
}

function parseTargetPath(rawPath: string | undefined): string {
  let resolvedPath = '';

  if (rawPath) {
    if (rawPath.includes('/') || rawPath.includes('.')) {
      resolvedPath = path.resolve(rawPath);
    } else {
      const modulePath = searchModuleAbsolutePath(rawPath);
      if (modulePath) {
        const originModuleName = path.basename(process.cwd());
        resolvedPath = path.resolve(modulePath, 'node_modules', originModuleName);
        console.log('RESOLVED PATH', resolvedPath, modulePath, originModuleName, process.cwd());
      }
    }
  }

  return resolvedPath;
}

function getConfiguration(programOptions: ProgramOptions): Configuration | undefined {
  let configs: Configuration | undefined;

  let fileTypes: string[] | undefined;
  if (programOptions.fileTypes) {
    fileTypes = programOptions.fileTypes.split('/');
  }
  const sources = programOptions.sources?.split('/');
  const ignoredSources = programOptions.ignoredSources?.split('/');
  configs = {
    target: {
      path: parseTargetPath(programOptions.target),
      fileTypes,
      sources,
      ignoredSources: ignoredSources
    }
  }

  return configs;
}

function printConfigurations(target: Target) {
  console.log(chalk.blueBright(chalk.bold('Target path:'), target.path));
  console.log(chalk.blueBright(chalk.bold('Sources:'), target.sources || 'Default (All)'));
  console.log(chalk.blueBright(chalk.bold('Ignored sources:'), target.ignoredSources || 'Default (node_modules, hidden files/folders)'));
  console.log(chalk.blueBright(chalk.bold('File types:'), target.fileTypes || `Default (${DEFAULT_FILE_TYPES})`));
}

function getSyncScriptCommand(target: Target) {
  const targetPath = target.path;
  const scriptPath = path.resolve(__dirname, './sync.js');
  const sources = (target.sources && `--sources ${target.sources}`) ?? '';
  const ignoredSources = (target.ignoredSources && `--ignored-sources ${target.ignoredSources}`) ?? '';
  return `"node ${scriptPath} ${sources} ${ignoredSources} --target ${targetPath}"`;
}

export async function runCli(args: string[]): Promise<void> {
  const {spawn} = require('child_process');
  const {Command} = require('commander');
  const program = new Command();
  program
    .option('-t, --target <target>', 'target')
    .option('-f, --file-types <fileTypes>', 'file types')
    .option('-s, --sources <sources>', 'sources')
    .option('-i, --ignored-sources <ignoredSources>', 'sources to ignore')
    .parse(args);

  const target = getConfiguration(program.opts())?.target;
  if (validateTarget(target)) {
    printConfigurations(target!);
    let fileTypes: string[] = [];
    (target!.fileTypes || DEFAULT_FILE_TYPES)
      .forEach((fileType: string) => fileTypes.push(`'**/*.${fileType}'`))
    try {
      const watchmanCommand = 'watchman-make';
      const watchmanArgs = ['-p', ...fileTypes, '--run',
        getSyncScriptCommand(target!)];
      console.log(chalk.green.bold('Running'), watchmanCommand, watchmanArgs.join(' '));
      spawn(watchmanCommand,
        watchmanArgs,
        {stdio: "inherit", shell: true});
    } catch (e) {
      console.warn('ERROR', e);
    }
  }
}
