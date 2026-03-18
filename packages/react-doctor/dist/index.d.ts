//#region src/types.d.ts
type Framework = "nextjs" | "vite" | "cra" | "remix" | "gatsby" | "unknown";
interface ProjectInfo {
  rootDirectory: string;
  projectName: string;
  reactVersion: string | null;
  framework: Framework;
  hasTypeScript: boolean;
  hasReactCompiler: boolean;
  sourceFileCount: number;
}
interface Diagnostic {
  filePath: string;
  plugin: string;
  rule: string;
  severity: "error" | "warning";
  message: string;
  help: string;
  line: number;
  column: number;
  category: string;
  weight?: number;
}
interface ScoreResult {
  score: number;
  label: string;
}
interface DiffInfo {
  currentBranch: string;
  baseBranch: string;
  changedFiles: string[];
  isCurrentChanges?: boolean;
}
interface ReactDoctorIgnoreConfig {
  rules?: string[];
  files?: string[];
}
interface ReactDoctorConfig {
  ignore?: ReactDoctorIgnoreConfig;
  lint?: boolean;
  deadCode?: boolean;
  verbose?: boolean;
  diff?: boolean | string;
}
//#endregion
//#region src/utils/get-diff-files.d.ts
declare const getDiffInfo: (directory: string, explicitBaseBranch?: string) => DiffInfo | null;
declare const filterSourceFiles: (filePaths: string[]) => string[];
//#endregion
//#region src/index.d.ts
interface DiagnoseOptions {
  lint?: boolean;
  deadCode?: boolean;
  includePaths?: string[];
}
interface DiagnoseResult {
  diagnostics: Diagnostic[];
  score: ScoreResult | null;
  project: ProjectInfo;
  elapsedMilliseconds: number;
}
declare const diagnose: (directory: string, options?: DiagnoseOptions) => Promise<DiagnoseResult>;
//#endregion
export { DiagnoseOptions, DiagnoseResult, type Diagnostic, type DiffInfo, type ProjectInfo, type ReactDoctorConfig, type ScoreResult, diagnose, filterSourceFiles, getDiffInfo };
//# sourceMappingURL=index.d.ts.map