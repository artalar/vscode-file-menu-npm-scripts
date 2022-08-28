"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const fs_1 = require("fs");
function activate(context) {
    let disposable = vscode.commands.registerCommand("vscode-file-menu-npm-scripts.showNpmScripts", async (uri) => {
        const packagePath = uri.path.endsWith("package.json")
            ? path.join(uri.path, "..")
            : uri.path;
        if ((await fs_1.promises.readdir(packagePath)).includes("package.json") === false) {
            vscode.window.showErrorMessage(`There is no package.json in "${uri.path}"`);
            return;
        }
        const packageJsonPath = path.join(packagePath, "package.json");
        const { scripts } = JSON.parse(await fs_1.promises.readFile(packageJsonPath, "utf8"));
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
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map