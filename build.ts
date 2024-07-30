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

import * as babel from '@babel/parser'
import { createBlock } from '../../template/block';
import { includes, uuid } from '../../lib/scratch-uuid';
import { BlockOpCode, ScratchBlock } from '../../class/Sprite';
import { NodeResult } from './types/Generation';
import { join } from 'path';
import { existsSync } from 'fs';
import { getScratchType, ScratchType } from './util/scratchType';

type ParsedFunctionCall = {
    node: string;
    args: (number | string | boolean)[];
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
    let args: (number | string | boolean)[] = [];

    if (argsString) {
        args = argsString.split(/,(?![^[]*]|[^()]*\)|[^{}]*})/).map(arg => {
            arg = arg.trim();
            if (arg === "true") return true;
            if (arg === "false") return false;
            if (!isNaN(Number(arg))) return Number(arg);
            if (arg.startsWith('"') && arg.endsWith('"')) return arg.slice(1, -1);
            if (arg.startsWith("'") && arg.endsWith("'")) return arg.slice(1, -1);
            return arg;
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

export function transpileFromSource(Source: any, FileName?: string) {
    let babelSource: any;

    if (typeof (Source) == "string") {
        babelSource = babel.parse(Source, {
            sourceFilename: FileName || "unknown"
        });
    } else {
        babelSource = Source
    }

    let initBlock = createBlock({
        opcode: BlockOpCode.EventWhenFlagClicked,
        topLevel: true
    });

    if (babelSource?.comments && babelSource.comments.length != 0) {
        let directiveComment = babelSource.comments[0];
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
                    if (!parsedFunc.args || !KEYS.includes(arguments[0])) {
                        arg = "space";
                    } else {
                        arg = parsedFunc.args[0];
                    }

                    initBlock.opcode = BlockOpCode.EventWhenKeyPressed;
                    initBlock.fields = { "KEY_OPTION": arg };
                    break;

                case BlockOpCode.EventWhenBackdropSwitchesTo:
                    initBlock.opcode = BlockOpCode.EventWhenBackdropSwitchesTo;
                    initBlock.fields = { "BACKDROP": [arguments[0] || "backdrop1"] };
                    break;

                case BlockOpCode.EventWhenGreaterThan:
                    let firstArg = String(parsedFunc.args[0]).toUpperCase();
                    let secondArg = parsedFunc.args[1];

                    if (!firstArg || firstArg != "LOUDNESS" && firstArg != "TIMER") {
                        firstArg = "LOUDNESS";
                    }

                    if (!secondArg || typeof (secondArg) != "number") secondArg = 0;

                    initBlock.opcode = BlockOpCode.EventWhenGreaterThan;
                    initBlock.inputs = { "VALUE": getScratchType(ScratchType.number, secondArg) };
                    initBlock.fields = { "WHENGREATERTHANMENU": [firstArg] };
                    break;

                case BlockOpCode.EventWhenBroadcastReceived:
                    let msgArg = parsedFunc.args[0];
                    if (!msgArg || typeof (msgArg) != "string") {
                        msgArg = "message1";
                    }

                    initBlock.opcode = BlockOpCode.EventWhenBroadcastReceived;
                    initBlock.fields = { "BROADCAST_OPTION": [msgArg, msgArg] }
                    break;
            }
        }
    }

    let initID = uuid(includes.alphanumeric_with_symbols, 5);

    let blocks = {
        [initID]: initBlock // Our Top-Level block.
    };

    if (!babelSource) return {};

    // Parser

    let programBody = babelSource.program && babelSource.program.body || babelSource.body;
    
    let generatorFolder = join(__dirname, "generator/");
    let previousNode: ScratchBlock | null = initBlock;
    let previousNodeID = initID;



    for (let i = 0; i < programBody.length; i++) {
        let item = programBody[i];
        let nodeType = item.type;
        let key = uuid(includes.alphanumeric_with_symbols, 5);

        let possibleGenerationFile = join(generatorFolder, nodeType) + ".ts";


        if (!existsSync(possibleGenerationFile)) continue;

        const module = require(possibleGenerationFile);

        const codeGeneration: NodeResult = module({
            index: i,
            ast: programBody,
            blocks: blocks,
            key: key
        }, Source);

        if (!codeGeneration) continue;


        if (codeGeneration.Block) {

            if (codeGeneration.Block.opcode == BlockOpCode.ProceduresDefinition) {
                blocks = {};
                blocks[key] = codeGeneration.Block;
            } else {
                // If there was a previous node, set its parent and next node.
                if (previousNode) {
                    codeGeneration.Block.parent = previousNodeID;
                    previousNode.next = key;
                };

                blocks[key] = codeGeneration.Block || {};
                previousNode = codeGeneration.Block;
                previousNodeID = key;
            }
        };

        Object.assign(blocks, codeGeneration.AdditionalBlocks || {});
        if (codeGeneration.Terminate) break;
    }

    // Util - Optimise
    function clearEmpties(o: { [key: string]: any }) {
        for (var k in o) {
            if (!o[k] || typeof o[k] !== "object") {
                continue;
            }

            if (Object.keys(o[k]).length === 0) {
                delete o[k];
            }
        }
        return o;
    }


    clearEmpties(blocks);

    return blocks;
}