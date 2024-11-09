// Once again, this code is pretty bad. But who cares lol

import chalk from "chalk";
import { execSync } from "child_process";
import { join } from "path";


const { readFileSync } = require('fs');


function faterror(str: string) {
    console.error(`[${chalk.red(chalk.bold('err'))}]: ${str}`)
    process.exit(1);
}

function grinfo(str: string) {
    return chalk.green(chalk.bold(str));
}

function ok(str: string) {
    console.log(`[${grinfo("ok")}]: ${str}`)
}

async function tryUpdate() {
    let content = await fetch("https://raw.githubusercontent.com/JS2Scratch/JS2Scratch/refs/heads/main/package.json");
    if (!content.ok) {
        faterror("Failed to retrieve latest version. Aborting!");
    }

    let jsonVersion: string[] = (await content.json()).version.split(".");
    let currentVersion: string[] = JSON.parse(readFileSync(join(__dirname, '../package.json')).toString()).version.split(".");

    let difs: number[] = [];
    jsonVersion.forEach((element, i) => {
        let currentEq = currentVersion[i];
        difs.push(Number(element) - Number(currentEq));
    });

    let needsUpdating = false;
    let isDev = false;
    difs.forEach((v) => {
        if (v > 0) {
            needsUpdating = true;
        } else if (v < 0) {
            isDev = true;
        }
    })

    if (!needsUpdating) {
        if (!isDev) {
            ok(`JS2Scratch is already on the latest available build (v${currentVersion.join(".")})`);
        } else {
            ok(`JS2Scratch is running on a dev-build (v${currentVersion.join(".")}-d)`)
        }
        return;
    } else {
        ok(`An update is available!`);
        ok(`Current version is ${grinfo(`v${currentVersion.join(".")}`)}, latest version is ${grinfo(`v${jsonVersion.join(".")}`)}!`);
        ok(`Updating to ${grinfo(`v${jsonVersion.join(".")}`)}!`);
        
        execSync(`git clone https://github.com/JS2Scratch/JS2Scratch/ ${join(__dirname, '../')} --force`)
    }
}

tryUpdate();