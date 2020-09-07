import * as path from 'path';

interface Target {
  path: string;
  fileTypes?: string[];
  sources?: string[];
}

interface Configuration {
  targets: Target[];
}

interface ProgramOptions {
  configuration?: string;
  target?: string;
  fileTypes?: string;
}

function getConfiguration(programOptions: ProgramOptions): Configuration | undefined {
  console.warn('RAW_CONFIGS', programOptions);
  let configs: Configuration | undefined;
  if (programOptions.configuration) {
    configs = require(programOptions.configuration);
  } else if (programOptions.target) {
    let fileTypes: string[] | undefined;
    if (programOptions.fileTypes) {
      fileTypes = programOptions.fileTypes.split('/');
    }
    configs = {
      targets: [{
        path: programOptions.target,
        fileTypes
      }]
    }
  }
  return configs;
}

export async function runCli(args: string[]): Promise<void> {
  console.warn('ARGS', args);
  const {Command} = require('commander');
  const program = new Command();
  program
    .option('-c, --configuration <configuration>', 'json/js configuration file')
    .option('-t, --target <target>', 'target')
    .option('-f, --file-types <fileTypes>', 'file types')
    .parse(args);

  let configs = getConfiguration(program.opts());

  console.log('CONFIGS', configs);
  if (configs?.targets) {
    for (let target of configs.targets) {
      console.warn('TARGET', target);
      let fileTypes: string[] = [];
      (target.fileTypes || ['js', 'jsx', 'ts', 'tsx', 'json'])
        .forEach((fileType: string) => fileTypes.push(`'**/*.${fileType}'`))
      let sources;
      if (target.sources) {
        sources = target.sources.join('/');
      }
      console.warn('Running', ['watchman-make', '-p', ...fileTypes,
        '--run', '"node', path.resolve(__dirname, './sync.js'),
        (sources && `--sources ${sources}`) ?? '', '--target', target.path, '"'].join(' '));
      console.warn('Running in', process.cwd());
      try {
        const {spawn} = require('child_process');
        const watchman = spawn('watchman-make',
          ['-p', ...fileTypes, '--run',
            `"node ${path.resolve(__dirname, './sync.js')} ${(sources && `--sources ${sources}`) ?? ''} --target ${target.path}"`],
          {stdio: "inherit", shell: true});
        watchman.on('close', () => {
          console.warn('WATCHMAN CLOSE');
        });
        watchman.on('exit', () => {
          console.warn('WATCHMAN EXIT');
        });
        console.warn('STARTED');
      } catch (e) {
        console.warn('ERROR', e);
      }
    }
  }
}
