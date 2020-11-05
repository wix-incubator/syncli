type Sources = string[];

interface SyncOptions {
  targetPath?: string;
  sources?: Sources;
  ignoredSources?: Sources;
}

interface Target {
  path: string;
  fileTypes?: string[];
  sources?: SourcesData;
  ignoredSources?: SourcesData;
}

interface Configuration {
  target: Target;
}

interface ProgramOptions {
  configuration?: string;
  fileTypes?: string;
  sources: string;
  ignoredSources: string;
}

interface SourcesData {
  sources: string[] | undefined;
  takenFrom: string[] | undefined;
}
