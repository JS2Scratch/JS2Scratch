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
 * Calls the inbuilt scratch libraries.
 */

import { join } from 'path';
import { existsSync } from 'fs';
import { warn } from '../../../../lib/console'
import { createBlock } from '../../../../template/block';
import { BlockOpCode } from '../../../../class/Sprite';

module.exports = ((CallExpression: { [key: string]: any }, OriginalSource: string, ParentID: string) => {
    CallExpression = CallExpression.expression;

    let callee = CallExpression.callee;
    // Library name
    if (callee.object && callee.object.name) {
        let libName = callee.object.name;
        let fnName = callee.property.name;
        
        let fullPath = join(__dirname, "CallExpressionSub", libName + ".ts");
        if (!existsSync(fullPath)) { warn(`Unknown library, got: '${libName}'`); return; }
        let requiredLib = require(fullPath);
        let requiredFn = requiredLib[fnName];

        if (!requiredFn) { warn(`Unknown function of library ${libName}, got: '${fnName}'`); return; }

        return requiredFn(CallExpression.arguments, ParentID, OriginalSource, CallExpression);
    } else {
        let fnName: string = callee.name;
        let turbo = false;

        if (fnName.startsWith("turbo_")) {
            turbo = true;
            fnName = fnName.substring(6);
        }

        return {
            Block: createBlock({
                opcode: BlockOpCode.ProceduresCall,
                mutation: {
                    tagName: "mutation",
                    children: [],
                    proccode: fnName,
                    argumentids: "[]",
                    warp: String(turbo),
                }
            })
        }
    }
})