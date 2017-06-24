import { Diagnostic } from "typescript";
import { Formatter, FormattedDiagnostic, groupByFile } from "./util";
import stylish from "./formatter/stylish";
import tsloader from "./formatter/tsloader";
import codeframe from "./formatter/codeframe";

export { FormattedDiagnostic };

export default function format(diagnostics: Array<Diagnostic>, format: string, context: string = process.cwd()) {
  let formatter: Formatter;

  switch (format) {
    case "stylish": {
      formatter = stylish;
      break;
    }
    case "ts-loader": {
      formatter = tsloader;
      break;
    }
    case "codeframe": {
      formatter = codeframe;
      break;
    }
    default: {
      throw new Error(`Formatter '${format}' is not supported.`);
    }
  }

  const groupedByFile = groupByFile(diagnostics);
  return Object.keys(groupedByFile)
    .map(file => groupedByFile[file])
    .map(diagnostics => formatter(diagnostics, context));
}
