import * as os from "os";
import { Diagnostic } from "typescript";
import { FormattedDiagnostic, formatFilePath, formatDiagnosticMessage } from "../util";
import codeFrame = require("babel-code-frame");
const chalk = require("chalk");

export default (diagnostics: Array<Diagnostic>, context: string): FormattedDiagnostic => {
  const filePath = formatFilePath(diagnostics[0].file.fileName, context);

  const message =
    diagnostics
      .map(diagnostic => {
        const lineChar = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const messageText =
          chalk.dim(` ${lineChar.line + 1}:${lineChar.character + 1}  `) +
          formatDiagnosticMessage(diagnostic, "", context);

        let message = messageText;

        const source = diagnostic.file.text || diagnostic.source;

        if (source) {
          const frame = codeFrame(
            source,
            lineChar.line + 1,
            lineChar.character,
            { linesAbove: 1, linesBelow: 1, highlightCode: true }
          )
            .split("\n")
            .map(str => `  ${str}`)
            .join("\n");

          message = [messageText, frame].join("\n");
        }
        return message + os.EOL;
      })
      .join(os.EOL) + os.EOL;

  return new FormattedDiagnostic(message, filePath);
};
