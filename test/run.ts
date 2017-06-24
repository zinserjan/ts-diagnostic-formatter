import { getTsConfigs, getDiagnostics } from "./util/testHelper";
import format from "../src/index";

const formatters = ["stylish", "ts-loader", "codeframe"];

formatters.forEach(formatter => {
  console.log(formatter);
  console.log("------");
  getTsConfigs().forEach((tsConfigPath: string) => {
    const diagnostics = getDiagnostics(tsConfigPath);

    const formattedDiagnostics = format(diagnostics, formatter);
    formattedDiagnostics.forEach(formatted => {
      console.log(formatted.file);
      console.log(formatted.message);
    });
  });
});
