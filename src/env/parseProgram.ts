/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : parseProgram.ts
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
import { BlockOpCode, generatedData } from "../util/types";
import { Error, ErrorPosition, Warn } from "../util/err";
import chalk from "chalk";
import { existsSync } from "fs";
import { join } from "path";
import { getScratchType, getVariable, ScratchType } from "../util/scratch-type";
import { includes, uuid } from "../util/scratch-uuid";

function extractSubstringFromCode(code: string, line: number) {
    const lines = code.split('\n');
    const targetLine = lines[line - 1];

    return targetLine.substring(6, 21);
}

type ParsedFunctionCall = {
    node: string;
    args: ({ type: ScratchType, value: any })[]
};

let KEYS = [
    "space",
    "up arrow",
    "down arrow",
    "left arrow",
    "any",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
]

function parseFunctionCall(str: string): ParsedFunctionCall {
    const regex = /^(\w+)\((.*)\)$/;
    const match = str.match(regex);

    if (!match) {
        return {
            node: BlockOpCode.EventWhenFlagClicked,
            args: []
        };
    }

    let node = match[1];

    const argsString = match[2].trim();
    let args: ({ type: ScratchType, value: any })[] = [];
    
    if (argsString) {
        args = argsString.split(/,(?![^[]*]|[^()]*\)|[^{}]*})/).map(arg => {
            arg = arg.trim();
            if (arg === "true") return { value: 1, type: ScratchType.number };
            if (arg === "false") return { value: 0, type: ScratchType.number };
            if (!isNaN(Number(arg))) return { value: Number(arg), type: ScratchType.number };
            if (arg.startsWith('"') && arg.endsWith('"')) return { value: arg.slice(1, -1), type: ScratchType.string };
            if (arg.startsWith("'") && arg.endsWith("'")) return { value: arg.slice(1, -1), type: ScratchType.string };
            
            return { value: arg, type: ScratchType.variable };
        });
    }

    if (node == "start_as_clone") {
        node = `control_${node}`;
    } else {
        node = `event_${node}`;
    }

    return {
        node: node,
        args: args
    };
}

export function parseProgram(string: string | BlockStatement, sourceFilename: string, includeHat: boolean, packageData: { [key: string]: any }) {
    let program
    let file;
    let firstIndex = ""
    
    if (typeof (string) == "string") {
        try {
            file = babel.parse(string, { sourceFilename });
            program = file.program.body;
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

    let initHat = uuid(includes.scratch_alphanumeric, 16);
    if (includeHat) {
        let initBlock = createBlock({
            topLevel: true
        });

        if (file && file.comments && file.comments.length != 0) {
            let directiveComment = file.comments[0];
            let commentSrc = directiveComment.value;

            
    
            if (commentSrc.substring(0, 1) == "#") {
                commentSrc = commentSrc.substring(1);
    
                let parsedFunc = parseFunctionCall(commentSrc);
                switch (parsedFunc.node) {
                    case BlockOpCode.EventWhenThisSpriteClicked:
                        initBlock.opcode = BlockOpCode.EventWhenThisSpriteClicked;
                        break;
    
                    case BlockOpCode.ControlStartAsClone:
                        initBlock.opcode = BlockOpCode.ControlStartAsClone;
                        break;
    
                    case BlockOpCode.EventWhenKeyPressed:
                        let arg;
                        if (!parsedFunc.args || !KEYS.includes(parsedFunc.args[0].value)) {
                            arg = "space";
                        } else {
                            arg = parsedFunc.args[0].value;
                        }
    
                       
                        initBlock.opcode = BlockOpCode.EventWhenKeyPressed;
                        initBlock.fields = { "KEY_OPTION": [arg,null] };
                        break;
    
                    case BlockOpCode.EventWhenBackdropSwitchesTo:
                        initBlock.opcode = BlockOpCode.EventWhenBackdropSwitchesTo;
                        initBlock.fields = { "BACKDROP": [parsedFunc[0] || "backdrop1"] };
                        break;
    
                    case BlockOpCode.EventWhenGreaterThan:
                        let firstArg = parsedFunc.args[0];
                        let secondArg = parsedFunc.args[1];

                        if (firstArg) firstArg.value = (firstArg.value as string).toUpperCase();
                        if (!firstArg || firstArg.type != ScratchType.string || firstArg.type == ScratchType.string && (!["LOUDNESS", "TIMER"].includes(firstArg.value))) {
                            firstArg = {
                                type: ScratchType.string,
                                value: "LOUDNESS"
                            };
                        }

                        let argC: any = null;
                        if (secondArg.type != ScratchType.variable) {
                            argC = getScratchType(secondArg.type, secondArg.value);
                        } else {
                            argC = getVariable(secondArg.value);
                        }
    
                        initBlock.opcode = BlockOpCode.EventWhenGreaterThan;
                        initBlock.inputs = { "VALUE": argC };
                        initBlock.fields = { "WHENGREATERTHANMENU": [firstArg.value] };
                        break;
    
                    case BlockOpCode.EventWhenBroadcastReceived:
                        let msgArg: any = parsedFunc.args[0];
                        if (!msgArg || msgArg.type != ScratchType.string) {
                            msgArg = "message1";
                        } else {
                            msgArg = msgArg.value
                        }
    
                        initBlock.opcode = BlockOpCode.EventWhenBroadcastReceived;
                        initBlock.fields = { "BROADCAST_OPTION": [msgArg, msgArg] }
                        break;
                }
            }
        }

        blockCluster.addBlocks({
            [initHat]: initBlock
        });
    }

    let lastKey = includeHat && initHat || null;

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
        if (data.doNotParent) continue;

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
