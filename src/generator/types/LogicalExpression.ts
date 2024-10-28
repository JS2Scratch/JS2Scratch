/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : LogicalExpression.ts
* Description       : Creates a logical expression.
*                   : Scratch is strict on these, so it must adhere
*                   : by its rules.
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { BlockCluster, createBlock, isSpikyType } from "../../util/blocks";
import { isCallExpression, LogicalExpression, SourceLocation } from "@babel/types"
import { getBlockNumber } from "../../util/scratch-type"
import { evaluate } from "../../util/evaluate"
import { includes, uuid } from "../../util/scratch-uuid";
import { BlockOpCode, buildData } from "../../util/types";
import { Error, ErrorPosition } from "../../util/err";

const numericalOperators: { [key: string]: BlockOpCode } = {
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

type LogicalOperators =
    | BlockOpCode.OperatorLessThan
    | BlockOpCode.OperatorGreaterThan
    | BlockOpCode.OperatorEquals
    | BlockOpCode.OperatorNot
    | BlockOpCode.OperatorAnd
    | BlockOpCode.OperatorOr;

const allowsAnyInput: { [key in LogicalOperators]: boolean } = {
    [BlockOpCode.OperatorLessThan]: true,
    [BlockOpCode.OperatorGreaterThan]: true,
    [BlockOpCode.OperatorEquals]: true,
    [BlockOpCode.OperatorNot]: false,
    [BlockOpCode.OperatorAnd]: false,
    [BlockOpCode.OperatorOr]: false
};

export function isComparisonOperator(value: string) {
    const operators = [">", "<", "==", "===", "!=", "!==", "<=", ">="];
    return operators.includes(value);
}

module.exports = ((BlockCluster: BlockCluster, LogicalExpression: LogicalExpression, ParentID: string, buildData: buildData) => {
    const id = uuid(includes.scratch_alphanumeric, 16);
    const leftHandSide = evaluate(LogicalExpression.left.type, BlockCluster, LogicalExpression.left, id, buildData);
    const rightHandSide = evaluate(LogicalExpression.right.type, BlockCluster, LogicalExpression.right, id, buildData);

    let op = numericalOperators[LogicalExpression.operator]

    // We have to be very strict here.
    // Scratch straight up REFUSES to compile sometimes..
    if (!allowsAnyInput[(op as LogicalOperators)]) {
        let errs: ErrorPosition[] = [];

        if (
            !(isCallExpression(LogicalExpression.left)
                && ((LogicalExpression as any).left.callee
                    && (LogicalExpression as any).left.callee.object
                    && (LogicalExpression as any).left.callee.property)
                && isSpikyType((LogicalExpression as any).left.callee.object.name, (LogicalExpression as any).left.callee.property.name))
            && LogicalExpression.left.type != "LogicalExpression"
            && LogicalExpression.left.type != "BooleanLiteral"
            && LogicalExpression.left.type != "UnaryExpression"
            && !(LogicalExpression.left.type == "BinaryExpression"
                && isComparisonOperator(LogicalExpression.left.operator))) {
            let loc = (LogicalExpression.left.loc as SourceLocation);
            errs.push(
                {
                    line: loc.start.line,
                    column: loc.start.column,
                    length: loc.start.line == loc.end.line && loc.end.column - loc.start.column || 1,
                    message: "This block requires the left-hand-side to be a spiky block. The input provided cannot be resolved as a spiky block."
                }
            );
        } else if (
            !(isCallExpression(LogicalExpression.right)
                && ((LogicalExpression as any).right.callee
                    && (LogicalExpression as any).right.callee.object
                    && (LogicalExpression as any).right.callee.property)
                && isSpikyType((LogicalExpression as any).right.callee.object.name, (LogicalExpression as any).right.callee.property.name))
            && LogicalExpression.right.type != "LogicalExpression"
            && LogicalExpression.right.type != "BooleanLiteral"
            && LogicalExpression.right.type != "UnaryExpression"
            && !(LogicalExpression.right.type == "BinaryExpression"
                && isComparisonOperator(LogicalExpression.right.operator))) {
            let loc = (LogicalExpression.right.loc as SourceLocation);
            errs.push(
                {
                    line: loc.start.line,
                    column: loc.start.column,
                    length: loc.start.line == loc.end.line && loc.end.column - loc.start.column || 1,
                    message: "This block requires the right-hand-side to be a spiky block. The input provided cannot be resolved as a spiky block."
                }
            );
        }

        let loc = (LogicalExpression.loc as SourceLocation);
        if (errs.length != 0) {
            new Error("Cannot resolve logical expression", buildData.originalSource, errs, loc.filename);
        }
    }

    BlockCluster.addBlocks({
        [id]: createBlock({
            opcode: numericalOperators[LogicalExpression.operator],
            parent: ParentID,
            inputs: {
                ["OPERAND1"]: leftHandSide.block,
                ["OPERAND2"]: rightHandSide.block,
            }
        })
    });

    return {
        isStaticValue: true,
        blockId: id,
        block: getBlockNumber(id)
    }
})