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
 * Evaluates a logical expression.
 */

import { isFunctionCurveBlock } from '../../../../class/Block';
import { BlockOpCode } from '../../../../class/Sprite';
import { errorMessages } from '../../../../lib/console';
import { uuid, includes } from '../../../../lib/scratch-uuid';
import { createBlock } from '../../../../template/block';
import { evaluate } from '../evaluateValue';
import { getBlockNumber } from '../scratchType';

interface Expr {
    operator: "+" | "-" | "*" | "/";
    left: any;
    right: any;

    start: number,
    end: number,

    loc: {
        [key: string]: any
    }
}

const numericalOperators = {
    '*': BlockOpCode.OperatorMultiply,
    '+': BlockOpCode.OperatorAdd,
    '-': BlockOpCode.OperatorSubtract,
    '/': BlockOpCode.OperatorDivide,
    '<': BlockOpCode.OperatorLessThan,
    '>': BlockOpCode.OperatorGreaterThan,
    '==': BlockOpCode.OperatorEquals,
    '===': BlockOpCode.OperatorEquals,
    '!': BlockOpCode.OperatorNot,
    '&&': BlockOpCode.OperatorAnd,
    '||': BlockOpCode.OperatorOr
};

module.exports = (LogicalExpression: Expr, ParentID: string, OriginalSource: string) => {
    const operatorID = uuid(includes.scratch_alphanumeric, 5);
    const leftOperand = evaluate(LogicalExpression.left, operatorID, OriginalSource);
    const rightOperand = evaluate(LogicalExpression.right, operatorID, OriginalSource);



    // These are workarounds.
    if (leftOperand.type != "LogicalExpression" || rightOperand.type != "LogicalExpression") {
        const leftCondition = LogicalExpression.left.type === "BinaryExpression" && 
            (LogicalExpression.left.operator === "==" || LogicalExpression.left.operator === "===") || LogicalExpression.left.type === "BooleanLiteral" || isFunctionCurveBlock(LogicalExpression.left) || LogicalExpression.left.type == "CallExpression" || LogicalExpression.left.type == "UnaryExpression";
        const rightCondition = LogicalExpression.right.type === "BinaryExpression" &&
            (LogicalExpression.right.operator === "==" || LogicalExpression.right.operator === "===") || LogicalExpression.right.type === "BooleanLiteral" || isFunctionCurveBlock(LogicalExpression.right) || LogicalExpression.right.type == "CallExpression" || LogicalExpression.left.type == "UnaryExpression";
        if (!leftCondition || !rightCondition) {
            
            errorMessages['Cannot resolve logical expression'](OriginalSource.substring(LogicalExpression.start, LogicalExpression.end), `file: ${LogicalExpression.loc.filename} line: ${LogicalExpression.loc.start.line} column: ${LogicalExpression.loc.start.column}`);
        }
    }

    let operator = LogicalExpression.operator;

    let mainBlock = {
        [operatorID]: createBlock({
            opcode: numericalOperators[operator],
            parent: ParentID,
            inputs: {
                "OPERAND1": leftOperand.block,
                "OPERAND2": rightOperand.block,
            }
        })
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