/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : berryProject.ts
* Description       : Creates a berry project
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 21/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { cwd } from "process";
import { DirectoryBuffer, FileBuffer } from "../util/fs";
import { join, resolve } from "path";
import chalk from "chalk";
import { existsSync, readFileSync } from "fs";

function createProjectContents(name: string, in_folder: string) {
    new FileBuffer("Berry.toml", `[package]\nname = '${name}'\n[dependencies]\n`).Instantiate(in_folder);
    new FileBuffer("project.d.json", JSON.stringify({ "sprites": ["Sprite1"] }, null, 2)).Instantiate(in_folder);
    new DirectoryBuffer("src").Append([
        new FileBuffer("Sprite1.js", 'looks.say("Hello, World!");')
    ]).Instantiate(in_folder);

    new DirectoryBuffer("assets").Append([
        new DirectoryBuffer("Sprite1").Append([
            new DirectoryBuffer("sound"),
            new DirectoryBuffer("costumes"),
        ])
    ]).Instantiate(in_folder);

    new DirectoryBuffer("lib").Instantiate(in_folder);
    new DirectoryBuffer("target").Instantiate(in_folder);
}

function error(string: string)
{
    console.log(chalk.red("error: ") + string);
    process.exit(1);
}

function berryProjectExistsAt(path: string)
{
    return existsSync(join(path, "Berry.toml")) && existsSync(join(path, "project.d.json"));
}

function validateJsonSchema(jsonString: string): void {
    try {
        const parsed = JSON.parse(jsonString);

        if (!Array.isArray(parsed.sprites)) {
            throw new Error(`"sprites" must be an array.`);
        }

        for (const sprite of parsed.sprites) {
            if (typeof sprite !== 'string') {
                throw new Error(`All elements in "sprites" must be strings.`);
            }
        }

        return;
    } catch (error: any) {
        error(error.message);
    }
}

export function createProject(name: string, at: string) {
    let projectPath: string = "";
    if (at != ".") {
        projectPath = resolve(join(at, name));
    }

    if (berryProjectExistsAt(projectPath))
    {
        error(`\`berry\` project '${name}' cannot be created as a project already exists here`);
        return;
    }

    if (at != ".") {
        new DirectoryBuffer(name).Instantiate(at);
    } else {
        projectPath = cwd();
    }

    createProjectContents(name, projectPath);
    console.log(chalk.green(chalk.bold("Creating ")) + `\`berry\` project '${name}'`);
    return;
}

export function buildProject(at: string)
{
    at = resolve(at);

    if (!berryProjectExistsAt(at))
    {
        error("could not find `Berry.toml` / `project.d.json`; are you sure this is a `berry` project?");
    }

    let defJson = readFileSync(join(at, "project.d.json"));
    validateJsonSchema(defJson.toString());
}