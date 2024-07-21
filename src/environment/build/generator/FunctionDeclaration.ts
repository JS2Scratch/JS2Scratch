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

import { BlockOpCode } from "../../../class/Sprite";
import { includes, uuid } from "../../../lib/scratch-uuid";
import { createBlock } from "../../../template/block";
import { GenerationParams, NodeResult } from "../types/Generation";
import { evaluate } from "../util/evaluateValue";
import { parseSubstack } from '../util/parseSubstack';
import { FunctionDeclaration } from '@babel/types';
import { getMenu } from "../util/scratchType";
import { transpileFromSource } from "../build";

// JS Syntax required
module.exports = ((Parameters: GenerationParams, OriginalSource: string) => {
    const specificNode: FunctionDeclaration = Parameters.ast[Parameters.index];
    let functionName = specificNode.id?.name || "main";
    let isTurbo = false;

    if (functionName.startsWith("turbo_")) {
        isTurbo = true;
        functionName = functionName.substring(6);
    }

    let customBlockKey = uuid(includes.scratch_alphanumeric, 5);
    let body = specificNode.body;
    let builtBody = transpileFromSource(OriginalSource.substring((body.start || 0) + 1, (body.end || 0) - 1 ), body.loc && body.loc.filename || "unknown");
    
    delete builtBody[Object.keys(builtBody)[0]];

    let startKey = Object.keys(builtBody)[0];
    builtBody[startKey].parent = Parameters.key;

    return {
        Block: createBlock({
            opcode: BlockOpCode.ProceduresDefinition,
            next: startKey,
            inputs: {
                "custom_block": getMenu(customBlockKey)
            },

            topLevel: true
        }),

        AdditionalBlocks: {
            ...builtBody,
            [customBlockKey]: createBlock({
                opcode: BlockOpCode.ProceduresPrototype,
                parent: Parameters.key,
                inputs: {},
                shadow: true,
                mutation: {
                    tagName: "mutation",
                    children: [],
                    proccode: functionName,
                    argumentids: "[]",
                    argumentnames: "[]",
                    argumentdefaults: "[]",
                    warp: String(isTurbo),
                }
            })
        },

        Terminate: true
    }
})