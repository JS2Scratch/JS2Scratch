/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : BinaryExpression.ts
* Description       : Creates a binary expression. Adds 2 numbers.
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { BlockCluster, createBlock, isSpiky, isSpikyType } from "../../util/blocks";
import { BinaryExpression, isCallExpression, SourceLocation } from "@babel/types"
import { getBlockNumber } from "../../util/scratch-type"
import { evaluate } from "../../util/evaluate"
import { includes, uuid } from "../../util/scratch-uuid";
import { BlockOpCode, buildData } from "../../util/types";
import { Error, ErrorPosition } from "../../util/err";
import { isComparisonOperator } from "./LogicalExpression";

const operators: { [key: string]: BlockOpCode } = {
    "+": BlockOpCode.OperatorAdd,
    "-": BlockOpCode.OperatorSubtract,
    "*": BlockOpCode.OperatorMultiply,
    "/": BlockOpCode.OperatorDivide,
    "==": BlockOpCode.OperatorEquals,
    "===": BlockOpCode.OperatorEquals,

    "!=": BlockOpCode.OperatorEquals,
    "!==": BlockOpCode.OperatorEquals,

    "<": BlockOpCode.OperatorLessThan,
    ">": BlockOpCode.OperatorGreaterThan,
}

const numericalFields: { [key: string]: string } = {
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

module.exports = ((BlockCluster: BlockCluster, BinaryExpression: BinaryExpression, ParentID: string, buildData: buildData) => {
    let id = uuid(includes.scratch_alphanumeric, 16);
    const leftHandSide = evaluate(BinaryExpression.left.type, BlockCluster, BinaryExpression.left, id, buildData);
    const rightHandSide = evaluate(BinaryExpression.right.type, BlockCluster, BinaryExpression.right, id, buildData);

    if (!["<=", ">="].includes(BinaryExpression.operator)) {
        BlockCluster.addBlocks({
            [id]: createBlock({
                opcode: operators[BinaryExpression.operator] || BlockOpCode.OperatorNot,
                parent: ParentID,
                inputs: {
                    [numericalFields[BinaryExpression.operator] + "1"]: leftHandSide.block,
                    [numericalFields[BinaryExpression.operator] + "2"]: rightHandSide.block,
                }
            })
        });

        if (["!=", "!=="].includes(BinaryExpression.operator)) {
            let oldId = id;
            id = uuid(includes.scratch_alphanumeric, 16);
            BlockCluster.blocks[id] = createBlock({
                opcode: BlockOpCode.OperatorNot,
                parent: ParentID,
                inputs: {
                    "OPERAND": getBlockNumber(oldId)
                }
            })
        }

        return {
            isStaticValue: true,
            blockId: id,
            block: getBlockNumber(id)
        }

    } else {
        let smallId = uuid(includes.scratch_alphanumeric, 16);
        let equalId = uuid(includes.scratch_alphanumeric, 16);

        let rightDouble = evaluate(BinaryExpression.right.type, BlockCluster, BinaryExpression.right, id, buildData);

        BlockCluster.addBlocks({
            [id]: createBlock({
                opcode: BlockOpCode.OperatorOr,
                parent: ParentID,
                inputs: {
                    ["OPERAND1"]: getBlockNumber(smallId),
                    ["OPERAND2"]: getBlockNumber(equalId),
                }
            }),

            [smallId]: createBlock({
                opcode: BinaryExpression.operator == "<=" && BlockOpCode.OperatorLessThan || BlockOpCode.OperatorGreaterThan,
                parent: id,
                inputs: {
                    ["OPERAND1"]: leftHandSide.block,
                    ["OPERAND2"]: rightHandSide.block,
                }
            }),

            [equalId]: createBlock({
                opcode: BlockOpCode.OperatorEquals,
                parent: id,
                inputs: {
                    ["OPERAND1"]: leftHandSide.block,
                    ["OPERAND2"]: rightDouble.block,
                }
            }),
        });

        return {
            isStaticValue: true,
            blockId: id,
            block: getBlockNumber(id)
        }
    }
})