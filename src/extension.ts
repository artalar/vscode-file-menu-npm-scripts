import * as vscode from "vscode";
import * as path from "path";
import { promises as fs } from "fs";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "vscode-file-menu-npm-scripts.showNpmScripts",
    async (uri: vscode.Uri) => {
      const packagePath = uri.path.endsWith("package.json")
        ? path.join(uri.path, "..")
        : uri.path;

      if ((await fs.readdir(packagePath)).includes("package.json") === false) {
        vscode.window.showErrorMessage(
          `There is no package.json in "${uri.path}"`
        );
        return;
      }

      const packageJsonPath = path.join(packagePath, "package.json");

      const { scripts } = JSON.parse(
        await fs.readFile(packageJsonPath, "utf8")
      );
      const script = await vscode.window.showQuickPick(Object.keys(scripts));

      if (script) {
        const command = `npm run ${script}`;
        const term = vscode.window.createTerminal({
          name: command,
          cwd: packagePath,
        });
        term.show();
        term.sendText(command);
      }
    }
  );

  context.subscriptions.push(disposable);
}
