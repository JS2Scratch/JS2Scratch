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

let subCommand = argv[2];

if (!subCommand) {
    errorMessages['No parameters passed']();
}

// Collect arguments to see what command to run.

let argumentsCollected = new_args([
    "-i", "-input",
    "-o", "-out", "-output",
    "-t", "-turbo", "-turbowarp"
], [
    ["-i", "-input"],
    ["-o", "-out", "-output"],
    ["-t", "-turbo", "-turbowarp"]
]);

switch (subCommand) {
    case "build":
        start_env(argumentsCollected);
        break;

    default:
        errorMessages['Unknown parameter'](subCommand);
}

