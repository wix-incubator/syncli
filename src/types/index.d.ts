type Sources = string[];

interface SyncOptions {
  targetPath?: string;
  sources?: Sources;
  ignoredSources?: Sources;
}

interface Target {
  path: string;
  fileTypes?: string[];
  sources?: string[];
  ignoredSources: string[];
}

interface Configuration {
  target: Target;
}

interface ProgramOptions {
  configuration?: string;
  target?: string;
  fileTypes?: string;
  sources: string;
  ignoredSources: string;
}
