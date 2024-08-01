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

import { userInfo } from "os";
import { Project } from "../class/Project";
import { createSprite } from "./sprite";
import { DirectoryBuffer, FileBuffer } from '../lib/fs';
import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';
import chalk from "chalk";

export function createProject(Folder: string, Name: string,  {
    targets = [],
    monitors = [],
    meta = {
        semver: "3.0.0",
        vm: "0.2.0",
        agent: userInfo().username,
        platform: {
            name: "TurboWarp",
            url: "https://turbowarp.org/"
        }
    }

}: Partial<Project> = {}, arg: { [key: string]: string }) {
    const startTime = new Date();

    let projectFolder = new DirectoryBuffer(Name);
    let newPath = projectFolder.Instantiate(Folder);

    let hasBackground = false;
    let hasSprite = false;
    for (let i = 0; i < targets.length; i++) {
        if (targets[i].isStage) hasBackground = true;
        if (!targets[i].isStage) hasSprite = true;
    }

    if (!hasSprite) { targets.push(createSprite({ isStage: false })); }
    if (!hasBackground) { targets.push(createSprite({ isStage: true })); }

    let retrievedStage;
    for (let i = 0; i < targets.length; i++) {
        if (targets[i].isStage) {
            retrievedStage = targets.splice(i, 1)[0];
            break;
        }
    }

    if (retrievedStage) {
        targets.unshift(retrievedStage);
    }

    let tmpDir = path.join(__dirname, '../tmp');
    let dirContent = fs.readdirSync(tmpDir);
    for (let i = 0; i < dirContent.length; i++) {
        let object = path.join(tmpDir, dirContent[i]);
        fs.renameSync(object, path.join(newPath, path.basename(object)));
    }

    let projectMain = new FileBuffer('project.json', JSON.stringify({
        targets: targets,
        monitors: monitors,
        meta: meta,
    }));

    projectMain.Instantiate(newPath);

    let newFinalPath = path.join(Folder, Name + ".sb3");
    if (fs.existsSync(newFinalPath)) fs.rmSync(newFinalPath);

    let path_7z: string;
    if (arg["-7z"] == "null") 
        {
            path_7z = "7z";
        } else {
            path_7z = '"' + arg["-7z"] + '"';
        }


    child_process.execSync(`cd ${path.join(Folder)}\ && ${path_7z} a -tzip "${path.basename(newPath)}.sb3" "${Name}/"`);

    const endTime = new Date();
    const timeDifference = Number(endTime) - Number(startTime);

    const timeInSeconds = timeDifference / 1000;
    const username = userInfo().username

    console.log(
        chalk.green(chalk.bold(
            "Finished "
        )) + `dev - ${username}@${Name} - [unoptimised] - ` + chalk.green(chalk.bold(
            `${timeInSeconds}s`
        ))
    );
   
    // Open the TurboWarp desktop app if it exists & the user is on windows.
    if (arg["-t"] === "true" && process.platform == "win32") {
        let turbowarpApp = `C:/Users/${username}/AppData/Local/Programs/TurboWarp/TurboWarp.exe`;
        let projectFile = `${newPath}.sb3`;

        if (fs.existsSync(turbowarpApp) && fs.existsSync(projectFile)) {
            child_process.execFileSync(turbowarpApp, [projectFile]);
        }
    }
}

