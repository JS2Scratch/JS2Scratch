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
import path, { basename, join, resolve } from "path";
import chalk from "chalk";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "fs";
import { createFileTree } from "./treeScan";
import { Block, Costume, Project, Sound, Sprite } from "../util/types";
import { cloneFolderSync, copyAllSync, createCostume, createSound, createSprite, deleteAllContents, fillDefaults, zipFolderToSb3 } from "../util/build-util";
import { parseProgram } from "../env/parseProgram";
import { userInfo } from "os";
import { execFileSync } from "child_process";
import * as toml from "@iarna/toml";
import { treeOptimise } from "../packages/tree-optimise/index"
import { Warn } from "../util/err";

function createProjectContents(name: string, in_folder: string) {
    new FileBuffer("Berry.toml", `[package]\nname = '${name}'\ntype = 'project'\n\n[dependencies]\n`).Instantiate(in_folder);
    new FileBuffer("project.d.json", JSON.stringify({ "sprites": ["Sprite1"] }, null, 2)).Instantiate(in_folder);
    new DirectoryBuffer("src").Append([
        new FileBuffer("Sprite1.js", 'looks.say("Hello, World!");')
    ]).Instantiate(in_folder);

    new DirectoryBuffer("assets").Append([
        new DirectoryBuffer("Sprite1").Append([
            new FileBuffer("sprite.json", JSON.stringify({
                x: 0,
                y: 0,
                size: 100,
                direction: 90,
                volume: 100,
                visible: true,
                currentCostume: 0,
                layerOrder: 0,
                privateVariables: [],
                privateLists: []
            }, null, 2)),

            new DirectoryBuffer("sound").Append([
                new FileBuffer("sound.json", "[]")
            ]),

            new DirectoryBuffer("costumes").Append([
                new FileBuffer("costumes.json", JSON.stringify([{ name: "Costume1", file: "default.svg" }], null, 2)),
                new FileBuffer("default.svg", `<svg xmlns="http://www.w3.org/2000/svg" width="46.944" height="74.148" viewBox="0 0 46.944 74.148"><g data-paper-data="{&quot;isPaintingLayer&quot;:true}" stroke-width="0" stroke-miterlimit="10" style="mix-blend-mode:normal"><path d="M12.047 15.937s22.88 7.452 22.689 7.964c-19.4 50.362-25.91 51.52-30.183 49.833-5.092-1.845-9.398-9.633 7.494-57.797" data-paper-data="{&quot;index&quot;:null}" fill="#d99e82"/><path d="M38.534 37.4c-6.17 4.912-11.357 4.95-19.424 3.753-5.066-1.212-5.27-1.378-7.629-2.49-1.685-.794-4.117-2.324-6.047-3.926-8.21-6.817-7.023-23.42 2.925-31.34C13.409-.622 18.627-.206 24.701.35c5.893.539 11.486 2.573 16.759 6.078 8.332 9.39 7.023 23.053-2.926 30.972" data-paper-data="{&quot;index&quot;:null}" fill="#fcb1e3"/></g></svg>`)
            ]),
        ]),

        new DirectoryBuffer("stage").Append([
            new FileBuffer("stage.json", JSON.stringify({
                volume: 100,
                currentCostume: 0,

                globalVariables: [],
                globalLists: {},
            })),

            new DirectoryBuffer("sound").Append([
                new FileBuffer("sound.json", "[]")
            ]),

            new DirectoryBuffer("backdrops").Append([
                new FileBuffer("backdrops.json", JSON.stringify([{ name: "Backdrop1", file: "stage.svg" }], null, 2)),
                new FileBuffer("stage.svg", `<svg version="1.1" width="2" height="2" viewBox="-1 -1 2 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- Exported by Scratch - http://scratch.mit.edu/ --></svg><!--rotationCenter:240:180-->`)
            ]),
        ]),
    ]).Instantiate(in_folder);

    new DirectoryBuffer("lib").Instantiate(in_folder);
    new DirectoryBuffer("target").Instantiate(in_folder);
}

function createPackageContents(name: string, in_folder: string) {
    new FileBuffer("Berry.toml", `[package]\nname = '${name}'\ntype = 'package'\n`).Instantiate(in_folder);
    new DirectoryBuffer("src").Append([
        new FileBuffer("index.ts", 'module.exports = {};')
    ]).Instantiate(in_folder);

    new DirectoryBuffer("utils").Append([
        new FileBuffer("internal.ts", readFileSync(join(__dirname, "../assets/internal.txt")).toString()),
        new FileBuffer("library.ts", readFileSync(join(__dirname, "../assets/library.txt")).toString()),
    ]).Instantiate(in_folder);
}

export function error(string: string) {
    console.error(chalk.red("error: ") + string);
    process.exit(1);
}

async function downloadGit(link: string): Promise<any> {
    const body: any[] = await (await fetch(link)).json() as any;
    let tree: any = {};

    for (const v of body) {
        if (v.type === "file") {
            const content = await (await fetch(v.download_url)).text();
            tree[v.name + "_FIL"] = content;
        } else if (v.type === "dir") {
            const subContent = await downloadGit(`${link}/${v.name}`);
            tree[v.name + "_DIR"] = subContent;
        }
    }

    return tree;
}

function warn(string: string) {
    console.warn(chalk.yellow("warn: ") + string);
}

function info(green: string, string: string) {
    console.log(chalk.green(chalk.bold(green)) + string);
}

function infoList(depth: number, green: string, string: string) {
    console.log(chalk.gray(" ".repeat(depth) + "- ") + chalk.green(chalk.bold(green)) + string);
}

function berryObjectExistsAt(path: string) {
    return existsSync(join(path, "Berry.toml"));
}

function berryProjectExistsAt(path: string) {
    return berryObjectExistsAt(path) && existsSync(join(path, "project.d.json")) && existsSync(join(path, "Berry.toml"));
}

function validateJsonSchema(parsed: { [key: string]: any }, name: string): void {
    try {
        if (!parsed["sprites"]) {
            throw new Error(`${name}/project.d.json: missing "sprites" array.`);
        }

        if (!Array.isArray(parsed.sprites)) {
            throw new Error(`${name}/project.d.json: "sprites" must be an array.`);
        }

        for (const sprite of parsed.sprites) {
            if (typeof sprite !== 'string') {
                throw new Error(`${name}/project.d.json: All elements in "sprites" must be strings.`);
            }
        }

        return;
    } catch (err: any) {
        error(err.message);
    }
}

function validatePropSchema(objects: any, basePath: string, name: string, type: string = "costumes.json") {
    let costumes: { [key: string]: string }[] = [];
    try {
        if (!Array.isArray(objects)) {
            throw new Error(`${name}: '${type}' must be an array`);
        }

        objects.forEach(obj => {
            if (typeof obj !== 'object' || !('name' in obj) || !('file' in obj)) {
                throw new Error(`${name}: each object must have a "name" and "file" property.`);
            }

            if (typeof obj.name !== 'string' || typeof obj.file !== 'string') {
                throw new Error(`${name}: The "name" and "file" properties must be strings.`);
            }

            const fullPath = path.join(basePath, obj.file);

            if (!existsSync(fullPath)) {
                throw new Error(`${name}: file does not exist: '${basename(fullPath)}'`);
            }

            const stats = statSync(fullPath);
            if (!stats.isFile()) {
                throw new Error(`${name}: not a file: '${basename(fullPath)}'`);
            }

            costumes.push({ name: obj.name, file: fullPath, x: obj.x || 0, y: obj.y || 0 });
        });
    } catch (err: any) {
        error(err.message);
    }

    return costumes;
}

function createTree(parent: DirectoryBuffer, tree: any) {
    let keys = Object.keys(tree);
    let values = Object.values(tree);

    values.forEach((v, i) => {
        let name = keys[i];
        if (name.endsWith("_FIL")) {
            name = name.slice(0, -4);
            parent.Append([new FileBuffer(name, (v as string))]);
        } else {
            name = name.slice(0, -4);
            let newBfr = new DirectoryBuffer(name);
            let newTree = createTree(newBfr, v);
            parent.Append([new DirectoryBuffer(name).Append([newTree])]);
        }
    });

    return parent;
}

async function downloadDep(name: string, tree: string, inside: string) {
    let parent = new DirectoryBuffer(name);
    let newTree: DirectoryBuffer = createTree(parent, tree);

    info("Added ", `package '${name}'`);
    newTree.Instantiate(inside);
}

export function createProject(name: string, at: string) {
    let projectPath: string = "";
    if (at != ".") {
        projectPath = resolve(join(at, name));
    }

    if (berryProjectExistsAt(projectPath)) {
        error(`\`berry\` project '${name}' cannot be created as a project already exists here`);
        return;
    }

    if (at != ".") {
        new DirectoryBuffer(name).Instantiate(at);
    } else {
        projectPath = cwd();
    }

    createProjectContents(name, projectPath);
    info("Creating ", `\`berry\` project '${name}'`);
    return;
}

export function createPackage(name: string, at: string) {
    let projectPath: string = "";
    if (at != ".") {
        projectPath = resolve(join(at, name));
    }

    if (berryObjectExistsAt(projectPath)) {
        error(`\`berry\` package '${name}' cannot be created as a package / project already exists here`);
        return;
    }

    if (at != ".") {
        new DirectoryBuffer(name).Instantiate(at);
    } else {
        projectPath = cwd();
    }

    createPackageContents(name, projectPath);
    info("Creating ", `\`berry\` package '${name}'`)
    return;
}

export function removeDep(libFolder: string, names: string[]) {
    if (!berryProjectExistsAt(cwd())) {
        error(`no \`berry\` project cannot be found`);
        return;
    }

    let bt = join(cwd(), "Berry.toml");
    let projectData: any = toml.parse(
        readFileSync(bt).toString()
    );

    if (!projectData.dependencies) {
        projectData.dependencies = {};
        info("Removed ", "0 packages");
        return;
    }

    readdirSync(libFolder).forEach((v, i) => {
        if (names.includes(v)) {
            let fullPath = join(libFolder, v);
            delete projectData.dependencies[v];

            rmSync(fullPath, { recursive: true });
        }
    });

    writeFileSync(bt, toml.stringify(projectData));
}

export async function updateDep(libFolder: string, bt: string) {
    let btProject = toml.parse(readFileSync(bt).toString());
    if (!btProject.dependencies) btProject.dependencies = {};

    let keys = Object.keys(btProject.dependencies);
    let values = Object.values(btProject.dependencies);

    let i = 0;
    for (const v of keys) {
        if (!existsSync(join(libFolder, v))) {
            info("Updating ", `package '${v}'`);
            await addDep({ key: { name: v, version: values[i] } });
        }

        i++;
    }
}

export async function addDep(libraries: { [key: string]: any }) {
    if (!berryProjectExistsAt(cwd())) {
        error(`no \`berry\` project cannot be found`);
        return;
    }

    let bt = join(cwd(), "Berry.toml");
    let projectData: any = toml.parse(
        readFileSync(bt).toString()
    );

    if (!projectData.dependencies) {
        projectData.dependencies = {};
    }

    let lib = join(cwd(), "lib");
    if (!existsSync(lib)) {
        mkdirSync(lib);
    } else if (!statSync(lib).isDirectory()) {
        rmSync(lib);
        mkdirSync(lib);
    }

    let values = Object.values(libraries);
    await Object.keys(libraries).forEach(async (_, index) => {
        try {
            let actualValue = values[index];
            let gitLink = "https://api.github.com/repos/JS2Scratch/berry-registry/contents/" + actualValue.name;
            let exists = await fetch(gitLink);

            if (exists.status == 404) {
                warn(`could not download '${actualValue.name}' since it cannot be found in the berry registry`);
            } else {
                if (actualValue.version == "*") {
                    let latestTest = await fetch(gitLink + "/latest.txt");
                    if (latestTest.status == 404) {
                        warn(`could not download '${actualValue.name}' since there is no 'latest' version`);
                    } else {
                        let latestVersion = await (await fetch((await latestTest.json() as any).download_url)).text();
                        let content = (await downloadGit(gitLink))[latestVersion.trim() + "_DIR"];
                        if (!content) {
                            warn(`could not download '${actualValue.name}' since there is no 'latest' version`);
                        } else {
                            await downloadDep(actualValue.name, content, lib)
                            projectData.dependencies[actualValue.name] = latestVersion.trim();
                            writeFileSync(bt, toml.stringify(projectData));
                        }
                    }
                } else {
                    let content = (await downloadGit(gitLink) as any)[actualValue.version + "_DIR"];
                    if (!content) {
                        warn(`could not download '${actualValue.name}' since there is no 'latest' version`);
                    } else {
                        await downloadDep(actualValue.name, content, lib)
                        projectData.dependencies[actualValue.name] = actualValue.version;
                        writeFileSync(bt, toml.stringify(projectData));
                    }
                }
            }
        } catch (err: any) {
            error(`an error occured while downloading package '${values[index].name}'; this error most likely will occur because you have sent too many API requests to github. Here is the error: \n\n` + err.message)
        }
    })
}

function optimiseTree(program: {[key: string]: Block}): {[key: string]: Block} {
    return treeOptimise(program);
}

export async function buildProject(argv: {[key: string]: any}, at: string, name: string) {
    let tags: string[] = [];
    let isOptimised = argv.optimize == true;

    if (isOptimised) Warn("Optimization is still in its ALPHA form and may corrupt your project.");

    info("Building ", name);

    tags.push(isOptimised && "[optimized]" || "[unoptimized]")

    let libFolder = join(__dirname, "../util/lib");
    deleteAllContents(libFolder);

    if (!berryProjectExistsAt(at)) {
        error("could not find `Berry.toml` / `project.d.json`; are you sure this is a `berry` project?");
    }

    let bt = toml.parse(readFileSync(join(at, "Berry.toml")).toString())
    if (!bt.package || bt.package && (bt.package as any).type != "project") {
        error("this is not a `berry` project!");
    }

    // Basically everything below just checks if the project is valid
    let defJson = JSON.parse(readFileSync(join(at, "project.d.json")).toString());
    validateJsonSchema(defJson, name);

    // Get assets
    let assets = path.join(at, "assets");
    if (!existsSync(assets) || !statSync(assets).isDirectory()) {
        error("could not find `assets` directory; did you remove or forget to add it?");
    }

    // Get src
    let src = path.join(at, "src");
    if (!existsSync(src) || !statSync(src).isDirectory()) {
        error("could not find `src` directory; did you remove or forget to add it?");
    }

    // Get libraries
    let lib = path.join(at, "lib");
    if (!existsSync(src) || !statSync(lib).isDirectory()) {
        error("could not find `lib` directory; did you remove or forget to add it?");
    }

    await updateDep(lib, join(at, "Berry.toml"));

    let broadcastJson = join(__dirname, "../assets/broadcasts.json");
    writeFileSync(broadcastJson, "[]");

    let fnJson = join(__dirname, "../assets/fn.json");
    writeFileSync(fnJson, "{}");

    let classJson = join(__dirname, "../assets/classData.json");
    writeFileSync(classJson, "{}");

    let sprites: string[] = readdirSync(assets);
    let libraries: string[] = readdirSync(lib);
    let spriteData: string[] = defJson.sprites;
    let collectedSpriteData: {
        [name: string]: {
            [data: string]: any,
        }
    } = {};
    let stageData: { [key: string]: any } = {};
    let config: { [key: string]: any } = fillDefaults({}, {
        libraries: {
            blockLibraries: [],
            valueLibraries: []
        },

        globals: [],
        implements: [],
        type_implements: [],
    });;

    libraries.forEach((value: string, index) => {
        let fullPath = join(lib, value);
        if (statSync(fullPath).isDirectory()) {
            let innerSrc = path.join(fullPath, "src");
            if (!existsSync(innerSrc) || !statSync(innerSrc).isDirectory()) {
                error(`could not find \`${basename(value)}/src\` directory; did you remove or forget to add it?`);
            }

            let innerUtil = path.join(fullPath, "utils");
            if (!existsSync(innerUtil) || !statSync(innerUtil).isDirectory()) {
                error(`could not find \`${basename(value)}/utils\` directory; did you remove or forget to add it?`);
            }

            let entry = join(innerSrc, "index.ts");
            if (!existsSync(entry) || !statSync(entry).isFile()) {
                error(`could not find \`${basename(value)}/src/index.ts\`; did you remove or forget to add it?`);
            }
        } else {
            error(`found file-based package '${value}' - file-based packages currently aren't allowed`);
        }
    })

    cloneFolderSync(lib, libFolder);

    readdirSync(libFolder).forEach(element => {
        info("Packaging ", element);
        let fullPath = join(libFolder, element);
        readdirSync(fullPath).forEach((value) => {
            let utilFolderPath = path.join(fullPath, 'utils');
            deleteAllContents(utilFolderPath)
            writeFileSync(join(utilFolderPath, "library.ts"), "import { createFunction, createLibrary, createValueFunction, createBlock, BlockClustering, BlockOpCode, buildData, typeData, Block, createGlobal, createImplementation } from '../../../lib-convert'; export { createFunction, createLibrary, createValueFunction, createBlock, BlockClustering, BlockOpCode, buildData, typeData, Block, createGlobal, createImplementation }");
            writeFileSync(join(utilFolderPath, "internal.ts"), "import { ScratchType, getSubstack, getScratchType, getColor, getVariable, getBlockNumber, getBroadcast, getMenu, getList } from '../../../scratch-type'; export { ScratchType, getSubstack, getScratchType, getColor, getVariable, getBlockNumber, getBroadcast, getMenu, getList };");
        });

        info("Building ", element);
        let index = join(fullPath, "src", "index.ts");
        let code = fillDefaults(require(index), {
            libraries: {
                blockLibraries: [],
                valueLibraries: []
            },

            globals: [],
            implements: [],
            type_implements: [],
        });

        config = {
            ...config,
            ...code,
        }
    });

    let srcTree = createFileTree(resolve(src));

    let variableJson = join(__dirname, "../assets/variables.json");
    let listJson = join(__dirname, "../assets/lists.json");
   
    spriteData.forEach((value: string) => {

        if (value == "stage") {
            error(`cannot create sprite named 'stage'!`);
        }

        if (!sprites.includes(value)) {
            error(`could not find sprite-data for included sprite '${value}'`);
        } else {
            let innerSprite = join(assets, value);

            if (!statSync(innerSprite).isDirectory()) {
                error(`sprite-data '${value}' is not a directory`);
            }

            let spriteJson = join(innerSprite, "sprite.json");
            if (!existsSync(spriteJson) || !statSync(spriteJson).isFile()) {
                error(`sprite-data '${value}' must have a 'sprite.json' which should be a file`);
            }

            collectedSpriteData[value] = {};
            collectedSpriteData[value].blocks = srcTree[value] || []
            collectedSpriteData[value].data = JSON.parse(readFileSync(spriteJson).toString());

            let innerSpriteData = readdirSync(innerSprite)
            if (innerSpriteData.includes("costumes")) {
                let costumesPath = join(innerSprite, "costumes");
                let costumesFolder = readdirSync(costumesPath)
                if (!costumesFolder.includes("costumes.json")) {
                    error(`no 'costumes.json' found in '${value}'/costumes`);
                }

                // TODO: Check if the file type is acceptable!
                let costumesJson = JSON.parse(readFileSync(join(costumesPath, "costumes.json")).toString());
                let costumes = validatePropSchema(costumesJson, costumesPath, value);
                collectedSpriteData[value]["costumes"] = costumes;
            } else {
                collectedSpriteData[value]["costumes"] = {
                    name: "Costume1",
                    file: resolve(join(__dirname, "../assets/ice_cream.svg"))
                }
            }

            if (innerSpriteData.includes("sound")) {
                let soundPath = join(innerSprite, "sound");
                let soundFolder = readdirSync(soundPath)
                if (!soundFolder.includes("sound.json")) {
                    error(`no 'sound.json' found in '${value}'/sound`);
                }

                // TODO: Check if the file type is acceptable!
                let soundJson = JSON.parse(readFileSync(join(soundPath, "sound.json")).toString());
                let sounds = validatePropSchema(soundJson, soundPath, value, "sound.json");
                collectedSpriteData[value]["sounds"] = sounds;
            }


        }
    })

    if (sprites.includes("stage")) {
        let stageDir = join(assets, "stage");
        stageData.blocks = srcTree["stage"] || []

        if (!statSync(stageDir).isDirectory()) {
            error(`asset 'stage' is not a directory`);
        }

        let stageJson = join(stageDir, "stage.json");
        if (!existsSync(stageJson) || !statSync(stageJson).isFile()) {
            error(`the 'stage' must have a 'stage.json' which should be a file`);
        }

        stageData.data = JSON.parse(readFileSync(stageJson).toString());

        let stageFolder = readdirSync(stageDir)
        if (stageFolder.includes("backdrops")) {
            let costumesPath = join(stageDir, "backdrops");
            let costumesFolder = readdirSync(costumesPath)
            if (!costumesFolder.includes("backdrops.json")) {
                error(`no 'backdrops.json' found in 'stage'/backdrops`);
            }

            // TODO: Check if the file type is acceptable!
            let costumesJson = JSON.parse(readFileSync(join(costumesPath, "backdrops.json")).toString());
            let costumes = validatePropSchema(costumesJson, costumesPath, "stage", "backdrops.json");
            stageData["costumes"] = costumes;
        } else {
            stageData["costumes"] = {
                name: "Backdrop1",
                file: resolve(join(__dirname, "../assets/background.svg"))
            }
        }

        if (stageFolder.includes("sound")) {
            let soundPath = join(stageDir, "sound");
            let soundFolder = readdirSync(soundPath)
            if (!soundFolder.includes("sound.json")) {
                error(`no 'sound.json' found in 'stage'/sound`);
            }

            // TODO: Check if the file type is acceptable!
            let soundJson = JSON.parse(readFileSync(join(soundPath, "sound.json")).toString());
            let sounds = validatePropSchema(soundJson, soundPath, "stage", "sound.json");
            stageData["sounds"] = sounds;
        }
    } else {
        stageData = {
            "costumes": [
                {
                    name: "Backdrop1",
                    file: resolve(join(__dirname, "../assets/background.svg"))
                }
            ],

            "sounds": {}
        }
    }

    // Project is valid!
    let tempParentLocation = resolve(join(__dirname, "../tmp"));
    let tempLocation = join(tempParentLocation, "temp_project");

    deleteAllContents(tempParentLocation); // Just incase; clear it!

    let start = new Date();
    new DirectoryBuffer("temp_project").Instantiate(tempParentLocation);

    collectedSpriteData["stage"] = stageData;

    let spriteDatas: any[] = Object.values(collectedSpriteData);
    let spriteNames = Object.keys(collectedSpriteData);
    let physicalSprites: Sprite[] = [];


    spriteDatas.forEach((value, index) => {
        writeFileSync(variableJson, "[]");     
        writeFileSync(listJson, "[]");     

        let spriteName = spriteNames[index];
        let costumes: Costume[] = [];
        let sounds: Sound[] = [];
        let blocks: any = {};

        (value.costumes as any[]).forEach((value: { [key: string]: string }) => {
            costumes.push(
                createCostume({
                    name: value.name,
                    path: value.file,
                    rotationCenterX: value.x as any,
                    rotationCenterY: value.y as any
                })
            );
        });

        (value.sounds as any[]).forEach((value: { [key: string]: string }) => {
            sounds.push(
                createSound({
                    name: value.name,
                    path: value.file
                })
            );
        });
        
        if (isOptimised) infoList(1, "Optimizing ", spriteName);
        (value.blocks as any[]).forEach((file: string) => {
            let content = readFileSync(file).toString();
            let program = parseProgram(content, basename(file), true, config).blocks;

            if (isOptimised) program = optimiseTree(program);
            blocks = {
                ...blocks,
                ...program
            };
        });

        let readVariables = JSON.parse(readFileSync(variableJson).toString()) as any[];
        let variables: any = {};

        let readLists = JSON.parse(readFileSync(listJson).toString()) as any[];
        let lists: any = {};

        readVariables.forEach((v, i) => {
            variables[v] = [
                v,
                0
            ]
        });

        readLists.forEach((v, i) => {
            lists[v] = [
                v,
                []
            ]
        });

        let spriteData = value.data;
        let variablesData: string[] = spriteData.privateVariables || [];
        let listsData: string[] = spriteData.privateLists || [];
 
        variablesData.forEach(element => {
            variables[element] = [element, 0]
        });

        listsData.forEach(element => {
            lists[element] = [element, []]
        });

        if (spriteName == "stage") {
            let empty: any[] = spriteData.globalVariables || [];
            let emptyLists: any = spriteData.globalLists || {};

            empty.forEach((j) => {
                variables[j] = [j, 0]
            });

            let listKeys = Object.entries(emptyLists);
            listKeys.forEach(element => {
                lists[element[0]] = [element[0], element[1]]
            });
        }

        physicalSprites.push(
            createSprite({
                name: spriteName,
                isStage: spriteName == "stage",
                variables,
                lists,
                blocks,
                costumes,
                sounds,

                x: spriteData.x,
                y: spriteData.y,
                size: spriteData.size,
                direction: spriteData.direction,
                volume: spriteData.volume,
                visible: spriteData.visible,
                currentCostume: spriteData.currentCostume,
                layerOrder: spriteData.layerOrder
            })
        );
    })

    let broadcastData = JSON.parse(readFileSync(broadcastJson).toString()) as string[];
    let broadcasts: any = {};

    broadcastData.forEach((v) => {
        broadcasts[v] = v;
    })

    physicalSprites.forEach((v) => {
        if (v.isStage) {
            v.broadcasts = broadcasts;
        }
    });

    let project: Project = {
        targets: physicalSprites,
        monitors: [],
        extensions: [],
        meta: {
            semver: "3.0.0",
            vm: "0.2.0",
            agent: userInfo().username,
            platform: {
                name: "TurboWarp",
                url: "https://turbowarp.org/"
            }
        }
    };

    let end = new Date();
    const timeDifference = (Number(end) - Number(start)) / 1000;

    let target = join(at, "target");
    if (!existsSync(target)) {
        mkdirSync(target, { recursive: true });
    } else {
        deleteAllContents(target);
    }

    let location = join(tempParentLocation, name)
    renameSync(tempLocation, join(tempParentLocation, name));
    writeFileSync(join(location, "project.json"), JSON.stringify(project));
    zipFolderToSb3(location);
    copyAllSync(tempParentLocation, join(at, "target"));
    deleteAllContents(tempParentLocation);

    info("Finished ", `${name} ${tags.join(" ")} in ${timeDifference}s`);
}

export async function runProject(argv: {[key: string]: any}, at: string, name: string) {
    await buildProject(argv, at, name);
    let target = join(at, "target");
    let compiled = join(target, `${name}.sb3`)

    if (existsSync(target) && existsSync(compiled)) {
        let turbowarpApp = `C:/Users/${userInfo().username}/AppData/Local/Programs/TurboWarp/TurboWarp.exe`;

        if (existsSync(turbowarpApp)) {
            info("Running ", `${name}.sb3`);
            execFileSync(turbowarpApp, [compiled]);
            info("Exited", ` ${name}.sb3`);
        } else {
            error("could not run build: cannot find turbowarp app")
        }
    }
}
