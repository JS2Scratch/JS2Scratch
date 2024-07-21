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
 * Evaluates a number.
 */

import { getScratchType, ScratchType } from '../scratchType'

module.exports = ((NumericLiteral: {[key: string]: any}) => {
    return {
        block: getScratchType(ScratchType.number, String(NumericLiteral.value)),
    };
})