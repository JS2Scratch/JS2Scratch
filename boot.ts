/**
 * ShadowX
 * 
 * Part of the "JS2Scratch" Project
 * 
 * [2024]
 * [ Made with love <3 ]
 *
 * @lisence MIT
 */

import { new_args } from './lib/arg'
import { argv } from 'process'
import { errorMessages } from './lib/console'
import { start_env } from './environment/env'
import { DirectoryBuffer, FileBuffer } from './lib/fs';

let subCommand = argv[2];

if (!subCommand) {
    errorMessages['No parameters passed']();
}

// Collect arguments to see what command to run.

let argumentsCollected = new_args([
    "-i", "-input",
    "-o", "-out", "-output",
    "-t", "-turbo", "-turbowarp",
    "-7z", "-7z_path"
], [
    ["-i", "-input"],
    ["-o", "-out", "-output"],
    ["-t", "-turbo", "-turbowarp"],
    ["-7z", "-7z_path"]
]);

switch (subCommand) {
    case "build":
        start_env(argumentsCollected);
        break;

    case "new":
        let newDir = new DirectoryBuffer("Project");
        let spriteDir = new DirectoryBuffer("Sprite1.sprite");
        let spriteMain = new FileBuffer("main.js", "");
        let projectJson = new FileBuffer("project.d.json", `{
    "Sprite1": {
        "Type": "Sprite",
        "Costumes": [],
        "Sounds": []
    }
}`)
        spriteDir.Append([spriteMain]);
        newDir.Append([projectJson, spriteDir]);

        if (argumentsCollected["-i"] == "null") argumentsCollected["-i"] = "";
        newDir.Instantiate(argumentsCollected["-i"]);
        break;
        
    default:
        errorMessages['Unknown parameter'](subCommand);
}

