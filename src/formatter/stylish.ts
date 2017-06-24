import * as os from "os";
import { Diagnostic, DiagnosticCategory } from "typescript";
import { FormattedDiagnostic, formatFilePath, formatDiagnosticMessage } from "../util";

const textTable = require("text-table");
const chalk = require("chalk");

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "warning": {
      return "yellow";
    }
    case "message": {
      return "blue";
    }
    default: {
      return "red";
    }
  }
};

export default (diagnostics: Array<Diagnostic>, context: string): FormattedDiagnostic => {
  const filePath = formatFilePath(diagnostics[0].file.fileName, context);

  const message = `${textTable(
    diagnostics.map(diagnostic => {
      const severity = DiagnosticCategory[diagnostic.category].toLowerCase();
      const severityColor = getSeverityColor(severity);
      const location = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);

      return [
        "",
        location.line + 1,
        location.character + 1,
        chalk[severityColor](severity),
        formatDiagnosticMessage(diagnostic, "", context),
        chalk.dim(`TS${diagnostic.code}`),
      ];
    }),
    {
      align: ["", "r", "l"],
      stringLength(str: string) {
        return chalk.stripColor(str).length;
      },
    }
  )
    .split("\n")
    .map((el: string) => el.replace(/(\d+)\s+(\d+)/, (m, p1, p2) => chalk.dim(`${p1}:${p2}`)))
    .join(os.EOL)}${os.EOL}`;

  return new FormattedDiagnostic(message, filePath);
};
