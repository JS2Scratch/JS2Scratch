/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : err.ts
*
* Description       : Rust-Like-Errors
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	None
*
/******************************************************************/

import chalk from "chalk";

export interface ErrorPosition {
    displayLine?: number,
    displayColumn?: number,
    
    line: number;
    column: number;
    length: number; 
    message?: string;
}

export class Error {
    constructor(
        public message: string,
        public codeSnippet: string,
        public positions: ErrorPosition[],
        public filePath: string,  
        public help?: string
    ) {
        this.displayError();
    }

    displayError() {
        const lines = this.codeSnippet.split('\n');

        console.error(`\n${chalk.red("error")}${chalk.bold(`: ${this.message}`)}`);

        this.positions.forEach((position, index) => {
            const errorLine = lines[(position.displayLine || position.line)- 1];
            const msg = position.line.toString().padStart(4);

            console.error(` ${chalk.blueBright(`${chalk.blue("-->")} ${this.filePath}:${chalk.blue(position.line)}:${chalk.blue((position.column))}`)}`);
            console.error(`${" ".repeat(msg.length + 1)}${chalk.blue("│")}`);

            console.error(`${chalk.bold(chalk.blue(msg))} ${chalk.blue("│")} ${errorLine}`);

            let arrowLine = ' '.repeat(Math.max(1, (position.displayColumn || position.column) - 1)) + chalk.red('╭') + chalk.red('─').repeat(position.length - 1) + chalk.red('^');
            console.error(`${" ".repeat(msg.length + 1)}${chalk.blue("│")} ${arrowLine}`);
            if (this.positions.length > 1 && index < this.positions.length - 1) {
                console.error(`${" ".repeat(msg.length + 1)}${chalk.blue("│")}`);
                console.error(`${" ".repeat(msg.length + 1)}${chalk.blue("│")}`);
            } else {
                console.error(`${" ".repeat(msg.length + 1)}${chalk.blue("╰──")}`);
            }

            if (position.message) {
                let split = position.message.split("\n");

                split.forEach(element => {
                    console.error(`${" ".repeat(msg.length + 1)}${chalk.blue("=")} ${chalk.bold("help")}: ${element}`);
                });
            }
        });

        if (this.help) {
            console.error(`\n${chalk.bold("help")}: ${this.help}`);
        }

        process.exit(1);
    }
}

export function Warn(message: string)
{
    console.warn(`${chalk.yellow("[Warn]: ")}${message}`);
    return;
}

export function FatalErr(message: string)
{
    console.error(`${chalk.red("[Fatal]: ")}${message}`);
    process.exit();
    return;
}