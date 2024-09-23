/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : treeScan.ts
* Description       : Sc
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 22/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import * as fs from 'fs';
import * as path from 'path';

interface FileTree {
    [key: string]: string | string[]; // Single file or folder with files
}

/**
 * Recursively processes directories, adding JS files to the folder if the folder doesn't start with '&'.
 * If a folder starts with '&', it is treated as its own group, and files inside it are treated separately.
 * @param dirPath - The current directory path to process.
 * @param parentKey - The current folder being processed as the root.
 * @param fileTree - The file tree object being built.
 */
function processDirectory(dirPath: string, parentKey: string, fileTree: FileTree, treatChildrenAsSeparate: boolean = false): void {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            if (!file.startsWith('&')) {
                if (!treatChildrenAsSeparate) {
                    if (!fileTree[parentKey]) {
                        fileTree[parentKey] = [];
                    }
                    processDirectory(fullPath, parentKey, fileTree, treatChildrenAsSeparate);
                } else {
                    processDirectory(fullPath, parentKey, fileTree, true);
                }
            } else {
                processDirectory(fullPath, file, fileTree, true);
            }
        } else if (stats.isFile() && file.endsWith('.js')) {
            if (treatChildrenAsSeparate) {
                fileTree[file.replace('.js', '')] = [fullPath];
            } else {
                if (!fileTree[parentKey]) {
                    fileTree[parentKey] = [];
                }
                (fileTree[parentKey] as string[]).push(fullPath);
            }
        }
    }
}

/**
 * Main function to create a file tree from the root directory.
 * @param rootDir - The root directory to start from.
 * @returns The file tree object.
 */
export function createFileTree(rootDir: string): FileTree {
    const fileTree: FileTree = {};

    const rootFiles = fs.readdirSync(rootDir);

    for (const file of rootFiles) {
        const fullPath = path.join(rootDir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory() && !file.startsWith('&')) {
            if (!fileTree[file]) {
                fileTree[file] = [];
            }

            processDirectory(fullPath, file, fileTree);
        } else if (stats.isDirectory() && file.startsWith('&')) {
            processDirectory(fullPath, file, fileTree, true);
        } else if (stats.isFile() && file.endsWith('.js')) {
            fileTree[file.replace('.js', '')] = [fullPath];
        }
    }

    for (const key in fileTree) {
        if (Array.isArray(fileTree[key]) && (fileTree[key] as string[]).length === 0) {
            delete fileTree[key];
        }
    }

    return fileTree;
}