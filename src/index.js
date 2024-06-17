const { createDir, createFile } = require('./utils/fs/create')
const { newProject } = require('./utils/project')
const block = require('./utils/scratch/block')

const path = require('path')
const fs = require('fs')

if (process.argv.length === 2 || process.argv[2] === "-c") {
    if (!process.argv[3]) { console.error("No input files."); process.exit() }
    const PROJECT_PATH = process.argv[3]
    const PROJECT_NAME = path.basename(process.argv[3])


    newProject(PROJECT_PATH, PROJECT_NAME, JSON.parse(fs.readFileSync(path.join(PROJECT_PATH, `${PROJECT_NAME}.d.json`)).toString()))

} else if (process.argv[2] === "-n") {
    const dp = path.join(process.cwd(), process.argv[3] || "Project")
    fs.existsSync(dp) && fs.rmSync(dp, { recursive: true }, (() => { }));

    let projectFolder = createDir(process.cwd(), process.argv[3] || "Project")
    createDir(projectFolder, "images")

    createFile(projectFolder, `${path.basename(projectFolder)}.d.json`, `{\n\t"Sprites": [\n\t\t{\n\t\t\t"name": "Sprite1"\n\t\t}\n\t]\n}`)
    createFile(projectFolder, `${"Sprite1"}.sprite.js`)
}