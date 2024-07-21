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
 * Evaluates a binary expression.
 */

import { BlockOpCode } from '../../../../class/Sprite';
import { uuid, includes } from '../../../../lib/scratch-uuid';
import { createBlock } from '../../../../template/block';
import { evaluate } from '../evaluateValue';
import { getBlockNumber } from '../scratchType';

type NumericalOperators = {
    "+": BlockOpCode;
    "-": BlockOpCode;
    "*": BlockOpCode;
    "/": BlockOpCode;
    "==": BlockOpCode;
    "===": BlockOpCode;
    "!=": undefined;
    "!==": undefined;
    "<": BlockOpCode;
    ">": BlockOpCode;
    
};

interface BinaryExpression {
    operator: "+" | "-" | "*" | "/" | "==" | "===" | "!=" | "!==" | "<" | ">";
    left: any; 
    right: any; 
}

const numericalOperators: NumericalOperators = {
    "+": BlockOpCode.OperatorAdd,
    "-": BlockOpCode.OperatorSubtract,
    "*": BlockOpCode.OperatorMultiply,
    "/": BlockOpCode.OperatorDivide,
    "==": BlockOpCode.OperatorEquals,
    "===": BlockOpCode.OperatorEquals,
    "!=": undefined,
    "!==": undefined,
    "<": BlockOpCode.OperatorLessThan,
    ">": BlockOpCode.OperatorGreaterThan,
};

const numericalFields = {
    "+": "NUM",
    "-": "NUM",
    "*": "NUM",
    "/": "NUM",
    "==": "OPERAND",
    "===": "OPERAND",
    "!=": "OPERAND",
    "!==": "OPERAND",
    "<": "OPERAND",
    ">": "OPERAND",
};

module.exports = (BinaryExpression: BinaryExpression, ParentID: string, OriginalSource: string) => {
    let operatorID = uuid(includes.scratch_alphanumeric, 5);
    const leftOperand = evaluate(BinaryExpression.left, operatorID, OriginalSource);
    const rightOperand = evaluate(BinaryExpression.right, operatorID, OriginalSource);

    let operator = BinaryExpression.operator;

    let mainBlock = {

        [operatorID]: createBlock({
            opcode: numericalOperators[operator] || BlockOpCode.OperatorNot,
            parent: ParentID,
            inputs: {
                [numericalFields[operator] + "1"]: leftOperand.block,
                [numericalFields[operator] + "2"]: rightOperand.block,
            }
        })
    };

    if (operator == "!=" || operator == "!==") {
        let equalsKey = uuid(includes.scratch_alphanumeric, 5);
        mainBlock[equalsKey] = createBlock({
            opcode: BlockOpCode.OperatorEquals,
            parent: operatorID,
            inputs: {
                [numericalFields[operator] + "1"]: leftOperand.block,
                [numericalFields[operator] + "2"]: rightOperand.block,
            }
        })

        mainBlock[operatorID].inputs = {
            "OPERAND": [
                2,
                equalsKey
            ]
        }
    };

    return {
        block: getBlockNumber(operatorID),

        additionalBlocks: {
            ...leftOperand.additionalBlocks,
            ...rightOperand.additionalBlocks,
            ...mainBlock
        },
    };
};