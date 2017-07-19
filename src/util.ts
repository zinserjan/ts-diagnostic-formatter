import * as path from "path";
import * as ts from "typescript";
import { Diagnostic, flattenDiagnosticMessageText } from "typescript";
import normalizePath = require("normalize-path");
import Es6Error = require("es6-error");

export interface GroupedDiagnostics {
  [fileName: string]: Array<Diagnostic>;
}

export interface Formatter {
  (diagnostics: Array<Diagnostic>, context: string): FormattedDiagnostic;
}

export class FormattedDiagnostic extends Es6Error {
  file?: string;

  constructor(message: string, file?: string) {
    super(message);
    this.file = file;
  }
}

const deduplicateDiagnostics: (diagnostics: Array<Diagnostic>) => Array<Diagnostic> = (ts as any)
  .sortAndDeduplicateDiagnostics;

export const groupByFile = (diagnostics: Array<Diagnostic>): GroupedDiagnostics => {
  const deduplicatedDiagnostics = deduplicateDiagnostics(diagnostics);

  return deduplicatedDiagnostics.reduce((groups: GroupedDiagnostics, diagnostic: Diagnostic) => {
    const fileName = diagnostic.file ? diagnostic.file.fileName : "global";
    if (!groups[fileName]) {
      groups[fileName] = [];
    }
    groups[fileName].push(diagnostic);
    return groups;
  }, {} as GroupedDiagnostics);
};

export const formatFilePath = (filePath: string, context: string) => {
  let fileName = normalizePath(path.relative(context, filePath));
  if (fileName && fileName[0] !== ".") {
    fileName = `./${fileName}`;
  }
  return fileName;
};

export const replaceAbsolutePaths = (message: string, context: string) => {
  const contextPath = normalizePath(context);
  return message.replace(new RegExp(contextPath, "g"), ".");
};

export const formatDiagnosticMessage = (diagnostic: Diagnostic, delimiter: string, context: string) => {
  return replaceAbsolutePaths(flattenDiagnosticMessageText(diagnostic.messageText, delimiter), context);
};
