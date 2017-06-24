import * as path from "path";
import * as fs from "fs";
import {
  SourceFile,
  Diagnostic,
  createCompilerHost,
  createProgram,
  readConfigFile,
  parseJsonConfigFileContent,
  sys,
} from "typescript";

export const getDiagnostics = (tsconfigPath: string) => {
  const config = readConfigFile(tsconfigPath, sys.readFile).config;
  const programConfig = parseJsonConfigFileContent(config, sys, path.dirname(tsconfigPath));
  const host = createCompilerHost(programConfig.options);
  const program = createProgram(programConfig.fileNames, programConfig.options, host);
  const filesToCheck: Array<SourceFile> = program.getSourceFiles();
  const diagnostics: Array<Diagnostic> = [];
  Array.prototype.push.apply(diagnostics, program.getGlobalDiagnostics());
  filesToCheck.forEach(file => Array.prototype.push.apply(diagnostics, program.getSyntacticDiagnostics()));
  filesToCheck.forEach(file => Array.prototype.push.apply(diagnostics, program.getSemanticDiagnostics(file)));

  return diagnostics;
};

const fixturePath = path.join(__dirname, "../fixture");

export const getTsConfigs = () => {
  const dirs = fs.readdirSync(fixturePath);
  return dirs.map(dir => path.join(fixturePath, dir, "tsconfig.json"));
};
