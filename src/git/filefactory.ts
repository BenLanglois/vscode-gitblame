import { access } from "fs";
import { Uri, workspace } from "vscode";

import { GitFile } from "./file";
import { GitFileDummy } from "./filedummy";
import { GitFilePhysical } from "./filephysical";

export class GitFileFactory {
    public static async create(
        fileName: string,
        disposeCallback: () => void,
    ): Promise<GitFile> {
        if (
            GitFileFactory.inWorkspace(fileName)
            && await this.exists(fileName)
        ) {
            return new GitFilePhysical(fileName, disposeCallback);
        } else {
            return new GitFileDummy(fileName, disposeCallback);
        }
    }

    private static inWorkspace(fileName: string): boolean {
        const uriFileName = Uri.file(fileName);

        return typeof workspace.getWorkspaceFolder(uriFileName) !== "undefined";
    }

    private static exists(fileName: string): Promise<boolean> {
        return new Promise((resolve): void => {
            access(fileName, (err): void => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
}
