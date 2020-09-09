import * as path from 'path';
import chalk from 'chalk';
import {DEFAULT_FILE_TYPES} from "./constants";

function getConfiguration(programOptions: ProgramOptions): Configuration | undefined {
  let configs: Configuration | undefined;

  if (programOptions.target) {
    let fileTypes: string[] | undefined;
    if (programOptions.fileTypes) {
      fileTypes = programOptions.fileTypes.split('/');
    }
    const sources = programOptions.sources?.split('/');
    const ignoredSources = programOptions.ignoredSources?.split('/');
    configs = {
      target: {
        path: programOptions.target,
        fileTypes,
        sources,
        ignoredSources: ignoredSources
      }
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
  const scriptPath = path.resolve(__dirname, './sync.js');
  const sources = (target.sources && `--sources ${target.sources}`) ?? '';
  const ignoredSources = (target.ignoredSources && `--ignored-sources ${target.ignoredSources}`) ?? '';
  return `"node ${scriptPath} ${sources} ${ignoredSources} --target ${target.path}"`;
}

export async function runCli(args: string[]): Promise<void> {
  const {spawn} = require('child_process');
  const {Command} = require('commander');
  const program = new Command();
  program
    .option('-c, --configuration <configuration>', 'json/js configuration file')
    .option('-t, --target <target>', 'target')
    .option('-f, --file-types <fileTypes>', 'file types')
    .option('-s, --sources <sources>', 'sources')
    .option('-i, --ignored-sources <ignoredSources>', 'sources to ignore')
    .parse(args);

  const target = getConfiguration(program.opts())?.target;
  if (target) {
    printConfigurations(target);
    let fileTypes: string[] = [];
    (target.fileTypes || DEFAULT_FILE_TYPES)
      .forEach((fileType: string) => fileTypes.push(`'**/*.${fileType}'`))
    try {
      const watchmanCommand = 'watchman-make';
      const watchmanArgs = ['-p', ...fileTypes, '--run',
        getSyncScriptCommand(target)];
      console.log(chalk.green.bold('Running'), watchmanCommand, watchmanArgs.join(' '));
      spawn(watchmanCommand,
        watchmanArgs,
        {stdio: "inherit", shell: true});
    } catch (e) {
      console.warn('ERROR', e);
    }
  } else {
    console.log(chalk.redBright.bold('Error: missing configurations. Please check you provided a target path'));
    console.log(chalk.whiteBright(`configurations: ${target}`));
  }
}
