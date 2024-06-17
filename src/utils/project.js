const path = require('path')

const { createDir, createFile } = require('./fs/create')
const { createSprite } = require('./scratch/sprite')
const chalk = require('chalk')

const fs = require('fs')
const os = require('os')
const { execSync } = require('child_process')

module.exports = {
    newProject: ((projectPath, projectName = "My Project", projectData = {}) => {

        const startTime = new Date();

        console.log(
            chalk.green(chalk.bold(
                "Building "
            )) + `${projectName} - v0.0.1 - (${projectPath})`
        )

        createDir(process.cwd(), "out")

        const dp = path.join(process.cwd(), "out", projectName);
        fs.existsSync(dp) && fs.rmSync(dp, { recursive: true }, (() => { }));

        // Create our home folder
        const PROJECT_FOLDER = createDir(path.join(process.cwd(), "out"), projectName)

        let PROJECT = {
            targets: [],
            monitors: [],
            extensions: [],
            meta: {
                "semver": "3.0.0",
                "vm": "0.2.0-prerelease.20210517191212",
                "agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.99 Safari/537.36",
                "jsonrpc": "2.0",
                "projectID": "999999999",
                "projectHost": "projects.scratch.mit.edu",
                "userAgent": "Scratch 3.0.0; https://scratch.mit.edu",
                "username": os.userInfo().username,
                "projectUrl": "https://scratch.mit.edu/projects/999999999/"
            }
        }

        for (let i = 0; i < projectData.Sprites.length; i++) {
            let object = projectData.Sprites[i]
            PROJECT.targets.push(createSprite(projectPath, PROJECT_FOLDER, object.name, object.isStage, object.x, object.y, object.costumes, object.sounds, object.visibe, object.size, object.direction, object.draggable, object.blocks, ))
        }

        let hasBackdrop = false
        for (let i = 0; i < PROJECT.targets; i++) {
            if (hasBackdrop) continue

            let object = projectData.Sprites[i]
            if (object.isStage === true) {
                hasBackdrop = false
            }
        }

        if (!hasBackdrop) { PROJECT.targets.push(createSprite(projectPath, PROJECT_FOLDER, "Stage", true)) }

        // Project.json
        createFile(PROJECT_FOLDER, "project.json", JSON.stringify(PROJECT))

        execSync(`7z a -tzip \"${path.join(process.cwd(), "out")}/${projectName}.sb3\" \"${PROJECT_FOLDER}\"`)

        const endTime = new Date();
        const timeDifference = endTime - startTime;
    
        const timeInSeconds = timeDifference / 1000;

        console.log(
            chalk.green(chalk.bold(
                "Finished "
            )) + `dev - ${os.userInfo().username}@${projectName} - [unoptimised] - ` + chalk.green(chalk.bold(
                `${timeInSeconds}s`
            ))
        )
    })
}

