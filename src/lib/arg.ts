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

import { argv } from "process";

// Returns a list of arguments and their values. If it doesn't exist, the value is null.
// E.g: "node src hello 5", would be: {["hello"]: "5"}
export function new_args(Args: string[], aliases: [string, ...string[]][]): { [key: string]: string } {
    argv.splice(0, 2);

    let argumentsCollected: { [key: string]: string } = Args.reduce((a, v) => ({ ...a, [v]: "null" }), {});

    let aliasMap: { [key: string]: string } = {};
    aliases.forEach((aliasGroup) => {
        const primary = aliasGroup[0];
        aliasGroup.forEach((alias) => {
            aliasMap[alias] = primary;
        });
    });

    let skip = false;
    for (let i = 0; i < argv.length; i++) {
        if (skip) {
            skip = false;
            continue;
        }

        let argKey = aliasMap[argv[i]] || argv[i];

        if (Args.includes(argKey)) {
            skip = true;
            argumentsCollected[argKey] = argv[i + 1] || "null";
        }
    }

    return argumentsCollected;
}