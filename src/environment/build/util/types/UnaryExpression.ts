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
 * Evaluates an unary expression.
 */

import { errorMessages } from '../../../../lib/console';
import { BlockOpCode } from '../../../../class/Sprite';
import { uuid, includes } from '../../../../lib/scratch-uuid';
import { createBlock } from '../../../../template/block';
import { evaluate } from '../evaluateValue';
import { getScratchType, ScratchType } from '../scratchType';
import { isFunctionCurveBlock } from '../../../../class/Block';

module.exports = ((UnaryExpression: { [key: string]: any }, ParentIndex: string, OriginalSource: string) => {
    // We have no way to represent if the value is negative or positive.
    let key = uuid(includes.alphanumeric_with_symbols, 5);

    const parsedRight = evaluate(UnaryExpression.argument, key, OriginalSource);

    // This is a workaround. 
    if (UnaryExpression.argument.type != "LogicalExpression" && UnaryExpression.argument.type != "BinaryExpression" && !isFunctionCurveBlock(UnaryExpression.argument) && UnaryExpression.operator == "!") {
        errorMessages['Cannot resolve logical expression'](OriginalSource.substring(UnaryExpression.start, UnaryExpression.end), `file: ${UnaryExpression.loc.filename} line: ${UnaryExpression.loc.start.line} column: ${UnaryExpression.loc.start.column}`);
    }

    let mainBlock = {
        [key]: createBlock({
            opcode: UnaryExpression.operator == "-" ? BlockOpCode.OperatorSubtract :
                    UnaryExpression.operator == "!" ? BlockOpCode.OperatorNot :
                    UnaryExpression.operator == "+" ? BlockOpCode.OperatorAdd :
                    BlockOpCode.OperatorAdd, 
            parent: ParentIndex,

            inputs: {
                "NUM1": getScratchType(ScratchType.number, "0"),
                "NUM2": parsedRight.block
            }
        })
    }

    if (UnaryExpression.operator == "!") {
        mainBlock[key].inputs["OPERAND"] = parsedRight.block;
        delete mainBlock[key].inputs["NUM1"];
        delete mainBlock[key].inputs["NUM2"];
    }

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
            ...parsedRight.additionalBlocks,
            ...mainBlock
        }
    };
})