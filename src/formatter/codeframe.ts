import * as os from "os";
import { Diagnostic } from "typescript";
import { FormattedDiagnostic, formatFilePath, formatDiagnosticMessage } from "../util";
import codeFrame = require("babel-code-frame");
const chalk = require("chalk");

export default (diagnostics: Array<Diagnostic>, context: string): FormattedDiagnostic => {
  const file = diagnostics[0].file != null ? diagnostics[0].file : null;
  const filePath = file != null ? formatFilePath(file.fileName, context) : undefined;

  const message =
    diagnostics
      .map(diagnostic => {
        const messageText = formatDiagnosticMessage(diagnostic, "", context);
        let message = messageText;

        if (diagnostic.file != null && diagnostic.start != null) {
          const lineChar = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
          const source = diagnostic.file.text || diagnostic.source;

          const messages = [chalk.dim(` ${lineChar.line + 1}:${lineChar.character + 1}  `) + messageText];

          if (source != null) {
            const frame = codeFrame(
              source,
              lineChar.line + 1,
              lineChar.character,
              { linesAbove: 1, linesBelow: 1, highlightCode: true }
            )
              .split("\n")
              .map(str => `  ${str}`)
              .join("\n");
            messages.push(frame);
          }
          message = messages.join("\n");
        }
        return message + os.EOL;
      })
      .join(os.EOL) + os.EOL;

  return new FormattedDiagnostic(message, filePath);
};
