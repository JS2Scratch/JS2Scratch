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

import chalk from "chalk";

// Pads zeros onto the left of the number until it's the specified length
function padZeros(number: number, length?: number) {
    let numberStr = number.toString();
    let isNegative = number < 0;

    length = length || 4;

    if (isNegative) length++; // Make up for the "-"

    while (numberStr.length < length) {
        numberStr = "0" + numberStr;
    }

    numberStr = numberStr.replace("-", "");
    if (isNegative) numberStr = numberStr = "-" + numberStr;

    return numberStr;
}

// Reports an error to stdout
export function error(Code: number, Message: string) {
    console.log(
        chalk.red(chalk.bold(`error[E${padZeros(Code)}]`)) + `: ${Message}`
    );

    process.exit(-1);
}

export function warn(Message: string) {
    console.log(
        chalk.yellow(chalk.bold(`warn`)) + `: ${Message}`
    );
}

// A collection of error messages.
export const errorMessages = {
    "No parameters passed": (() => {
        error(-1, "Invalid command. No parameters were passed.\nTranspilation terminated.");
    }),

    "Unknown parameter": ((Param: string) => {
        error(-2, `Invalid command. Unknown parameter, got: '${Param}'.\nTranspilation terminated.`);
    }),

    "No input directory": (() => {
        error(-3, "No input directory.\nTranspilation terminated.");
    }),

    "No such input directory": ((Path: string) => {
        error(-4, `No such file or directory, '${Path}'. No input directory.\nTranspilation terminated.`);
    }),

    "Input directory was a file": ((Path: string) => {
        error(-5, `The input directory, '${Path}', was a file, and not a directory.\nTranspilation terminated.`);
    }),

    "File Structure": ((Errors: string[]) => {
        error(-6, `The following errors occured while checking the project file structure and definition file:\n\n${Errors.join("\n")}\n\nTranspilation terminated.`);
    }),


    //

    "Cannot resolve logical expression": ((ExprAsStr: string, File: string) => {
        error(1, `${File}: Failed to resolve logical expression: "${ExprAsStr}" at ${File}\n\nScratch does not support this type of logical expression. Scratch requires a: "!" (not), "&&" (and), or "||" (or) expression - and they must also end with a "spikey-ended block" (E.g, the x = y block).\n\nAn example of a valid expression: "5 == 5 && 3 == 3"\nAn example of an invalid expression: "5 == 5 && 3"`);
    }),

    "First argument of FOR loop is not an identifier": ((File: string) => {
        error(2, `${File}: For loops expect their first parameter to be an identifier.\n\nExample:\n\nCorrect: let i = 0; for (i; i < 5; i++) {\nIncorrect: for (let i = 0; i < 5; i++) {`);
    }),

    "Second argument of FOR loop is not a valid expression": ((File: string) => {
        error(3, `${File}: For loops expect their second parameter to be a binary / logical expression.\n\nExample:\n\nCorrect: for (let i = 0; i < 5; i++) {\nIncorrect: for (let i = 0; "Hello, world!"; i++) {`);
    }),

    "Third argument of FOR loop is not an update expression": ((File: string) => {
        error(4, `${File}: For loops expect their third parameter to update a value.\n\nExample:\n\nCorrect: for (let i = 0; i < 5; i++) {\nIncorrect: for (let i = 0; i < 5; "Hello, world!") {`);
    }),

    "Switch statement must switch a variable": ((File: string) => {
        error(5, `${File}: Switch statements expect the discriminant to be a variable\n\nExample:\n\nCorrect: let x = 0; switch (x) {\nIncorrect: switch (5) {`);
    }),

    "Not enough arguments": ((File: string, fnName: string, argsGiven: number, argsReq: number) => {
        if (argsGiven >= argsReq) return;
        error(6, `${File}: Function '${fnName}' requires ${argsReq} argument(s), but only ${argsGiven} argument(s) were passed.`);
    }),

    "Function does not contain a constructor": ((File: string) => {
        error(7, `${File}: Function does not contain a valid constructor.\n\nE.g:\n\nCorrect: operation.join(a, b);\nIncorrect: join(a, b);`)
    }),

    "Attempt to call unknown constructor function": ((File: string, Constructor: string) => {
        error(8, `${File}: Attempt to call unknown function with constructor: ${Constructor}.`)
    }),

    "Attempt to call unknown function": ((File: string, Constructor: string, fnName: string) => {
        error(9, `${File}: Attempt to call unknown function: ${Constructor}.${fnName}()`)
    }),
};