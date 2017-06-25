import * as os from "os";
import * as path from "path";
import { getTsConfigs, getDiagnostics } from "./util/testHelper";
import format from "../src/index";
const chalk = require("chalk");

chalk.enabled = true;

const formatters = ["stylish", "ts-loader", "codeframe"];
const tsconfigs = getTsConfigs();

formatters.forEach(formatter => {
  describe(`${formatter} formatter`, () => {
    tsconfigs.forEach((tsConfigPath: string) => {
      const dir = path.basename(path.dirname(tsConfigPath));

      it(dir, () => {
        const diagnostics = getDiagnostics(tsConfigPath);
        const formattedDiagnostics = format(diagnostics, formatter);

        formattedDiagnostics.forEach(formatted => {
          formatted.message = formatted.message.replace(os.EOL, "\n");
          expect({ file: formatted.file, message: formatted.message }).toMatchSnapshot();
        });
      });
    });
  });
});
