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

// JS Syntax required
module.exports = ((Parameters: GenerationParams, OriginalSource: string): NodeResult => {
    let specificNode = Parameters.ast[Parameters.index];
    let declarations = specificNode.declarations[0];
    let variableName = declarations.id.name;
    let variableValue = evaluate(declarations.init, Parameters.key, OriginalSource);

    return {
        Block: createBlock({
            opcode: BlockOpCode.DataSetVariableTo,
            inputs: {
                "VALUE": variableValue.block
            },
            fields: {
                "VARIABLE": [
                    variableName,
                    variableName
                ]
            }
        }),

        AdditionalBlocks: variableValue.additionalBlocks || {},
    };
})