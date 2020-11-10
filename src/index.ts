import * as path from 'path';
import chalk from 'chalk';
import {DEFAULT_FILE_TYPES, DEFAULT_IGNORED_SOURCES_DESCRIPTION, LIST_ARGUMENT_SPLITTER} from "./constants";
import fs from 'fs';
import _ from 'lodash';

enum Actions {
  TO = 'to'
}

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
            const isMonoRepo = fs.readdirSync(moduleAbsolutePath)?.includes(moduleName);
            if (isMonoRepo) {
              moduleAbsolutePath = path.resolve(moduleAbsolutePath, moduleName);
            }
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
      }
    }
  }

  return resolvedPath;
}

function getSources(programOptions: ProgramOptions): SourcesData {
  let takenFrom;
  let sources = programOptions.sources?.split(LIST_ARGUMENT_SPLITTER);

  if (!sources) {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    sources = fs.existsSync(packageJsonPath) && require(packageJsonPath).files;
    if (sources) {
      takenFrom = ['"files" from package.json']
    }
  }

  return {sources, takenFrom};
}

function getIgnoredSources(programOptions: ProgramOptions): SourcesData {
  let takenFrom;
  let sources = programOptions.ignoredSources?.split(LIST_ARGUMENT_SPLITTER);

  if (!sources) {
    sources = ['.git'];
  }

  if (!sources) {
    const parse = require('parse-gitignore');

    const npmIgnorePath = path.resolve(process.cwd(), '.npmignore');
    const gitIgnorePath = path.resolve(process.cwd(), '.gitignore');
    const npmIgnoreItems = fs.existsSync(npmIgnorePath) && parse(fs.readFileSync(npmIgnorePath));
    const gitIgnoreItems = fs.existsSync(gitIgnorePath) && parse(fs.readFileSync(gitIgnorePath));

    if (npmIgnoreItems || gitIgnoreItems) {
      sources = _.union(npmIgnoreItems, gitIgnoreItems);
      takenFrom = [];
      npmIgnoreItems && takenFrom.push('.npmignore');
      gitIgnoreItems && takenFrom.push('.gitignore');
    }
  }

  return {sources, takenFrom};
}

function getConfiguration(targetPath: string, programOptions: ProgramOptions): Configuration | undefined {
  let configs: Configuration | undefined;

  let fileTypes: string[] | undefined;
  if (programOptions.fileTypes) {
    fileTypes = programOptions.fileTypes.split(LIST_ARGUMENT_SPLITTER);
  }

  const sources = getSources(programOptions);
  const ignoredSources = getIgnoredSources(programOptions);

  configs = {
    target: {
      path: parseTargetPath(targetPath),
      fileTypes,
      sources,
      ignoredSources: ignoredSources
    }
  }

  return configs;
}

function printConfigurations(target: Target) {
  console.log(chalk.blueBright(chalk.bold('Target path:'), target.path));
  if (target.sources) {
    console.log(chalk.blueBright(chalk.bold('Sources:'), target.sources.takenFrom ? `taken from ${target.sources.takenFrom}` : (target.sources.sources || 'Default (All)')));
  }
  if (!target.sources?.sources && target.ignoredSources) {
    console.log(chalk.blueBright(chalk.bold('Ignored sources:'), target.ignoredSources.takenFrom ? `taken from ${target.ignoredSources.takenFrom}` : (target.sources?.sources || 'not defined')));
  }
  console.log(chalk.blueBright(chalk.bold('File types:'), target.fileTypes || `Default (${DEFAULT_FILE_TYPES})`));
}

function getSyncScriptCommand(target: Target) {
  const targetPath = target.path;
  const scriptPath = path.resolve(__dirname, './sync.js');
  const sources = (target.sources?.sources && `--sources ${target.sources.sources}`) ?? '';
  const ignoredSources = (target.ignoredSources?.sources && `--ignored-sources ${target.ignoredSources.sources}`) ?? '';
  return `"node ${scriptPath} ${sources} ${ignoredSources} --target ${targetPath}"`;
}

export async function runCli(args: string[]): Promise<void> {
  const {spawn} = require('child_process');
  const {Command} = require('commander');
  const program = new Command();
  program
    .arguments('<command> [targetPath]')
    .usage('to <target-path> [options]')
    .option('-f, --file-types <fileTypes>', `File types that will be synced.\nSplit by ','.\nExample: ts,jsx,xml\nDefault are ${DEFAULT_FILE_TYPES}`)
    .option('-s, --sources <sources>', `Files/folders from the root folder that will be synced.\nSplit by ','.\nExample: src,strings,someFile.js\nThe default is all.`)
    .option('-i, --ignored-sources <ignoredSources>', `Files/folders from the root folder that will NOT be synced.\nSplit by ','.\nExample: node_modules,someIgnoredFile.json\nThe default is:\n${DEFAULT_IGNORED_SOURCES_DESCRIPTION}`)
    .action((command: string, targetPath: string) => {
      if (command === Actions.TO) {
        const target = getConfiguration(targetPath, program.opts())?.target;
        if (validateTarget(target)) {
          printConfigurations(target!);
          let fileTypes: string[] = [];
          (target!.fileTypes || DEFAULT_FILE_TYPES).forEach((fileType: string) => fileTypes.push(`'**/*.${fileType}'`));
          const watchmanCommand = 'watchman-make';
          const watchmanArgs = ['-p', ...fileTypes, '--run',
            getSyncScriptCommand(target!)];
          console.log(chalk.green.bold('Running'), '\n', watchmanCommand, '\n', watchmanArgs.join('\n'), '\n------------\n');
          spawn(watchmanCommand,
            watchmanArgs,
            {stdio: "inherit", shell: true});
        }
      }
    })
    .parse(args);
}
