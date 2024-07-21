/**
 * ShadowX
 * 
 * Part of the "JS2Scratch" Project
 * 
 * [2024]
 * [ Made with love <3 ]
 *
 * @lisence MIT
 * 
 * @description
 * Evaluates a boolean.
 */

import { BlockOpCode } from '../../../../class/Sprite';
import { uuid, includes } from '../../../../lib/scratch-uuid';
import { createBlock } from '../../../../template/block';
import { getScratchType, ScratchType } from '../scratchType';

module.exports = ((BooleanLiteral: {[key: string]: any}, ParentIndex: string) => {
    // There is no "true" or "false" block in scratch. Instead, we shall check if "1 == 1" (true) or "1 == 0" (false).
    let key = uuid(includes.alphanumeric_with_symbols, 5);
    
    return {
        block: [ // We're not using the scratch type as this is a custom-defined block.
            3,
            key,
            [
                4,
                ""
            ]
        ],
        
        additionalBlocks: {
            [key]: createBlock({
                opcode: BlockOpCode.OperatorEquals,
                parent: ParentIndex,

                inputs: {
                    "OPERAND1": getScratchType(ScratchType.number, "1"),
                    "OPERAND2": getScratchType(ScratchType.number, BooleanLiteral.value === true ? "1" : "0")
                }
            })
        }
    };
})