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
import { createBlock } from "../../../template/block";
import { GenerationParams, NodeResult } from "../types/Generation";
import { evaluate } from "../util/evaluateValue";
import { parseSubstack } from '../util/parseSubstack';

// JS Syntax required
module.exports = ((Parameters: GenerationParams, OriginalSource: string): NodeResult => {
    const specificNode = Parameters.ast[Parameters.index];

    // First parse the "test"
    const whileTest = evaluate(specificNode.test, Parameters.key, OriginalSource);

    const mainBodyData = parseSubstack(Parameters, specificNode.body, specificNode.loc.filename);
    let bodyBlocks = mainBodyData.blocks;
    let substackStart = mainBodyData.startIndex;

    let opCode = BlockOpCode.ControlWhile;
    if (specificNode.test.type == "BooleanLiteral" && specificNode.test.value === true) opCode = BlockOpCode.ControlForever;

    return {
        Block: createBlock({
            opcode: opCode,
            parent: Parameters.key,
            inputs: {
                "CONDITION": whileTest.block,
                "SUBSTACK": substackStart !== undefined ? [2, substackStart] : undefined,
            }
        }),

        AdditionalBlocks: {
            ...whileTest.additionalBlocks,
            ...bodyBlocks || {},
        },

        Terminate: opCode == BlockOpCode.ControlForever
    };
})