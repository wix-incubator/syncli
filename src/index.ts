import * as path from 'path';

interface Target {
  path: string;
  fileTypes?: string[];
  sources?: string[];
  ignoreSources: string[];
}

interface Configuration {
  targets: Target[];
}

interface ProgramOptions {
  configuration?: string;
  target?: string;
  fileTypes?: string;
  sources: string;
  ignoreSources: string;
}

const DEFAULT_IGNORE_SOURCES = ['node_modules'];

function getConfiguration(programOptions: ProgramOptions): Configuration | undefined {
  let configs: Configuration | undefined;
  if (programOptions.configuration) {
    configs = require(programOptions.configuration);
  } else if (programOptions.target) {
    let fileTypes: string[] | undefined;
    if (programOptions.fileTypes) {
      fileTypes = programOptions.fileTypes.split('/');
    }
    const sources = programOptions.sources?.split('/');
    const ignoreSources = programOptions.ignoreSources?.split('/');
    configs = {
      targets: [{
        path: programOptions.target,
        fileTypes,
        sources,
        ignoreSources
      }]
    }
  }

  configs?.targets?.forEach((target) => {
    if (!target.ignoreSources) {
      target.ignoreSources = DEFAULT_IGNORE_SOURCES;
    }
  });

  return configs;
}

export async function runCli(args: string[]): Promise<void> {
  const {Command} = require('commander');
  const program = new Command();
  program
    .option('-c, --configuration <configuration>', 'json/js configuration file')
    .option('-t, --target <target>', 'target')
    .option('-f, --file-types <fileTypes>', 'file types')
    .option('-s, --sources <sources>', 'sources')
    .option('-i, --ignore-sources <ignoreSources>', 'sources to ignore')
    .parse(args);

  let configs = getConfiguration(program.opts());

  if (configs?.targets) {
    for (let target of configs.targets) {
      console.warn('TARGET', target);
      let fileTypes: string[] = [];
      (target.fileTypes || ['js', 'jsx', 'ts', 'tsx', 'json'])
        .forEach((fileType: string) => fileTypes.push(`'**/*.${fileType}'`))
      console.warn('Running', ['watchman-make', '-p', ...fileTypes,
        '--run', '"node', path.resolve(__dirname, '../'),
        (target.sources && `--sources ${target.sources}`) ?? '', '--target', target.path, '"'].join(' '));
      console.warn('Running in', process.cwd());
      try {
        const {spawn} = require('child_process');
        spawn('watchman-make',
          ['-p', ...fileTypes, '--run',
            `"node ${path.resolve(__dirname, './sync.js')} ${(target.sources && `--sources ${target.sources}`) ?? ''} ${(target.ignoreSources && `--ignore-sources ${target.ignoreSources}`) ?? ''} --target ${target.path}"`],
          {stdio: "inherit", shell: true});
      } catch (e) {
        console.warn('ERROR', e);
      }
    }
  }
}
