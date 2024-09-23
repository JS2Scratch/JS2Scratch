/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : blocks.ts
*
* Description       : Creates a Scratch-AST
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial creation
*
/******************************************************************/

import { BlockStatement } from "@babel/types";
import * as babel from "@babel/parser"
import { BlockCluster, createBlock } from "../util/blocks";
import { generatedData } from "../util/types";
import { Error, ErrorPosition, Warn } from "../util/err";
import chalk from "chalk";
import { existsSync } from "fs";
import { join } from "path";

function extractSubstringFromCode(code: string, line: number) {
    const lines = code.split('\n');
    const targetLine = lines[line - 1];

    return targetLine.substring(6, 21);
}


export function parseProgram(string: string | BlockStatement, sourceFilename: string, includeHat: boolean, packageData: { [key: string]: any }) {
    let program
    let firstIndex = ""

    if (typeof (string) == "string") {
        try {
            program = babel.parse(string, { sourceFilename }).program.body;
        } catch (error: any) {
            if (error.code == "BABEL_PARSER_SYNTAX_ERROR") {
                let errorPos: ErrorPosition = {
                    line: error.loc.line,
                    column: error.loc.column,
                    displayColumn: 5,
                    length: 5,
                    message: "There is a syntax error in your code. Make sure all your code is valid.",
                };

                new Error(`Babel syntax error: '${error.reasonCode}'`, extractSubstringFromCode(string, error.loc.line), [errorPos], sourceFilename);
            }

            process.exit();
        }
    } else {
        string = (string as BlockStatement)
        program = string.body;
    }

    let blockCluster = new BlockCluster();
    if (includeHat) {
        blockCluster.addBlocks({
            ["_init"]: createBlock({
                topLevel: true
            })
        })
    }

    let lastKey = includeHat && "_init" || null;
    for (let i = 0; i < program.length; i++) {
        let fileData = join(__dirname, "../", `generator/${program[i].type}`);
        if (program[i].type == "EmptyStatement") continue;

        let data: any;

        let s = false;
        for (let i = 0; i < packageData.implements.length; i++) {
            if (packageData.implements[i].name == program[i].type) {
                data = packageData.implements[i].body;
                s = true;
                break;
            }
        }

        if (!existsSync(fileData + ".ts") && !s) {
            Warn(`No \`impl\` for '${program[i].type}'`);
            continue;
        } else if (!s) {
            data = require(fileData);
        }

        data = data(blockCluster, program[i], { instruction: i, originalSource: string, packages: packageData });
        if (!data) continue;
        if (data.err) continue;

        let firstKey = data.keysGenerated[0];

        if (!firstKey) continue;
        if (i == 0) firstIndex = firstKey;
        if (lastKey != null) {
            blockCluster.blocks[lastKey].next = firstKey;
            blockCluster.blocks[firstKey].parent = lastKey;
        }

        if (data.terminate) break;

        lastKey = data.keysGenerated[data.keysGenerated.length - 1]; // The last key
    }

    return { blocks: blockCluster.blocks, firstIndex };
}