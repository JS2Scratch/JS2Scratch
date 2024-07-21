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
 * Evaluates a function call.
 */

import { BlockOpCode } from '../../../../class/Sprite';
import { uuid, includes } from '../../../../lib/scratch-uuid';
import { createBlock } from '../../../../template/block';
import { getScratchType, ScratchType } from '../scratchType';
import { errorMessages } from "../../../../lib/console";
import { join } from 'path';
import { existsSync } from 'fs';

module.exports = ((CallExpression: { [key: string]: any }, ParentIndex: string, OriginalSource: string) => {
    let callee = CallExpression.callee;
    
    let fileData = `file: ${callee.loc.filename} line: ${callee.loc.start.line} column: ${callee.loc.start.column}`;

    if (!callee.object) errorMessages["Function does not contain a constructor"](fileData)
    let fnName = callee.property.name;
    let constructor = callee.object.name;
    let fullPath = join(__dirname, "CallExpressionSub", constructor + ".ts");

    if (!existsSync(fullPath)) errorMessages["Attempt to call unknown constructor function"](fileData, constructor);
    let requiredConstructor = require(fullPath);

    let requiredFn = requiredConstructor[fnName]
    if (!requiredFn) errorMessages["Attempt to call unknown function"](fileData, constructor, fnName);

    return requiredFn(CallExpression.arguments, ParentIndex, OriginalSource, CallExpression)
})