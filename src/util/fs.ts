/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : fs.ts
* Description       : FS-Util
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";

// A better "fs" (file-system) module.

// The directory class. Allows easy creation of Directories for later use.
export class DirectoryBuffer {
    Name: string;
    Content: (FileBuffer | DirectoryBuffer)[];
    Type: "Directory";

    // Creates a directory.
    constructor(Name?: string) {
        this.Name = Name || "a";
        this.Content = [];
        this.Type = "Directory";
    };

    // Adds Files to the Directory.
    Append(File: (FileBuffer | DirectoryBuffer)[]): DirectoryBuffer {
        if (Array.isArray(File)) {
            for (let i = 0; i < File.length; i++) {
                let FileInQuestion = File[i];
                this.Content.push(FileInQuestion)
            }
        } else {
            this.Content.push(File)
        }

        return this
    };

    // Creates the directory and all files within.
    Instantiate(At: string): string {
        let dirPath = join(At, this.Name);

        existsSync(dirPath) && rmSync(dirPath, { recursive: true });

        mkdirSync(dirPath);

        for (let i = 0; i < this.Content.length; i++) {
            let object = this.Content[i];
            object.Instantiate(dirPath);
        }

        return dirPath
    }
}

// The File-Buffer Class. Used for creation of files for later use.
export class FileBuffer {
    Name: string;
    Content: string;
    Type: "File";

    // Creates a file buffer.
    constructor(Name?: string | undefined, Content?: string | undefined) {
        this.Name = Name || "a.txt";
        this.Content = Content || "";
        this.Type = "File";
    }

    // Changes the extension of the file
    ChangeExtension(Ext: string): FileBuffer {
        const nameParts = this.Name.split('.');
        if (nameParts.length > 1) {
            nameParts.pop();
        }
        nameParts.push(Ext);
        this.Name = nameParts.join('.');

        return this;
    }

    // Creates the file.
    Instantiate(At: string): string {
        let filePath = join(At, this.Name);
        writeFileSync(filePath, this.Content);

        return filePath;
    }
}

// Reads a file as a string.
export function readFile(path: string): string {
    return readFileSync(path).toString();
}