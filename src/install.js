// Send a nice lil' message to the user :)
// This code is terrible; but who cares?

const chalk = require('chalk');
const { readFileSync } = require('fs');

function centerText(text, ot) {
    const terminalWidth = process.stdout.columns;
    const lines = text.split('\n');
    let ol = ot.split('\n');
    let index = 0;
    const centeredLines = lines.map(line => {
        const strippedLine = ol[index]
        const padding = Math.max((terminalWidth - strippedLine.length) / 2, 0);
        index += 1;
        return ' '.repeat(Math.floor(padding)) + line;
    });
    return centeredLines.join('\n');
}

const packageJson = './package.json';

const textNoAnsi = `✨ Thanks for downloading JS2Scratch v${JSON.parse(readFileSync(packageJson).toString()).version}! 💫` + "\n" +
    `Your feedback really means a lot to us.. like.. a LOT!` + "\n" +
    `We would really appreciate you leaving us feedback on the github!` + "\n\n" +
    "In the meantime, why don't you read our documentation? Might help you now and then >;)" + "\n" +
    "Aaand that's it! JS2Scratch has downloaded! Enjoy! ~ saaawdust" + "\n\n" + 
    "(press enter to exit)";

const text = chalk.bold(`✨ Thanks for downloading JS2Scratch v${JSON.parse(readFileSync(packageJson).toString()).version}! 💫`) + "\n" +
    chalk.italic(`Your feedback really means a lot to us.. like.. a ${chalk.bold("LOT")}!`) + "\n" +
    chalk.italic(`We would really appreciate you leaving us feedback on the \u001b]8;;https://github.com/JS2Scratch\u001b\\github\u001b]8;;\u001b\\!`) + "\n\n" +
    chalk.italic("In the meantime, why don't you read our documentation? Might help you now and then >;)") + "\n" +
    chalk.italic(`Aaand that's it! JS2Scratch has downloaded! Enjoy! ~ ${chalk.bold("saaawdust")}`) + "\n\n" + 
    chalk.italic("(press enter to exit)");

console.clear();
console.log(centerText(text, textNoAnsi));
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', () => {
    console.clear();
    process.exit();
});