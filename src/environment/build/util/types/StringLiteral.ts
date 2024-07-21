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
 * Evaluates a string.
 */

import { getScratchType, ScratchType } from '../scratchType'

module.exports = ((StringLiteral: {[key: string]: any}) => {
    return {
        block: getScratchType(ScratchType.string, String(StringLiteral.value)),
    };
})