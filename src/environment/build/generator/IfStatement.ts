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
    const ifTest = evaluate(specificNode.test, Parameters.key, OriginalSource);

    const mainBodyData = parseSubstack(Parameters, specificNode.consequent, specificNode.loc.filename);
    let bodyBlocks = mainBodyData.blocks;
    let substackStart = mainBodyData.startIndex;

    let bodyBlocks2;
    let substackStart2;

    if (specificNode.alternate != null) {
        const consequentData = parseSubstack(Parameters, specificNode.alternate, specificNode.loc.filename);
        
        bodyBlocks2 = consequentData.blocks;
        substackStart2 = consequentData.startIndex;
    }


    const commonFields = {
        "CONDITION": ifTest.block,
        "SUBSTACK": substackStart !== undefined ? [2, substackStart] : undefined,
        "SUBSTACK2": substackStart2 !== undefined ? [2, substackStart2] : undefined,
    }

    return {
        Block: createBlock({
            opcode: bodyBlocks2 !== undefined ? BlockOpCode.ControlIfElse : BlockOpCode.ControlIf,
            parent: Parameters.key,
            inputs: commonFields
        }),

        AdditionalBlocks: {
            ...ifTest.additionalBlocks,
            ...bodyBlocks || {},
            ...bodyBlocks2 || {},
        }
    };
})