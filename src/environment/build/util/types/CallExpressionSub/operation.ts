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
 * Operational blocks.
 */
;
import { evaluate } from "../../../util/evaluateValue";
import * as block from "../../../../../template/block";
import { BlockOpCode } from "../../../../../class/Sprite";
import { getBlockNumber } from "../../../util/scratchType";
import { errorMessages } from "../../../../../lib/console";
import { includes, uuid } from "../../../../../lib/scratch-uuid";

function getFileData(expr: any): string {
    return `file: ${expr.callee.loc.filename} line: ${expr.callee.loc.start.line} column: ${expr.callee.loc.start.column}`;
}

module.exports = {
    join: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 3) errorMessages["Not enough arguments"](getFileData(fullExpr), "join", args.length, Number.MAX_SAFE_INTEGER)

        let leftKey = uuid(includes.scratch_alphanumeric, 5);
        let leftOperand = evaluate(args[0], leftKey, OriginalSource);

        let blocks = {
            ...leftOperand.additionalBlocks
        }

        for (let i = 0; i < args.length; i++) {
            let newJoinBlockId = uuid(includes.scratch_alphanumeric, 5);
            let rightOperand = evaluate(args[i], leftKey, OriginalSource);

            let newJoinBlock = {
                [newJoinBlockId]: block.createBlock({
                    opcode: BlockOpCode.OperatorJoin,
                    parent: parentID,
                    inputs: {
                        "STRING1": (i == 1) ? leftOperand.block : getBlockNumber(leftKey),
                        "STRING2": rightOperand.block,
                    }
                })
            }

            blocks = {
                ...blocks,
                ...rightOperand.additionalBlocks,
                ...newJoinBlock
            }

            leftKey = newJoinBlockId;
        }

        return {
            block: getBlockNumber(leftKey),
            additionalBlocks: blocks
        }
    }),

    getLetterOfString: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 2) errorMessages["Not enough arguments"](getFileData(fullExpr), "getLetterOfString", args.length, 2)

        let numberAmount = evaluate(args[0], parentID, OriginalSource);
        let str = evaluate(args[1], parentID, OriginalSource);

        let key = uuid(includes.scratch_alphanumeric, 5);

        return {
            block: getBlockNumber(key),
            additionalBlocks: {
                ...numberAmount.additionalBlocks,
                ...str.additionalBlocks,
                [key]: block.createBlock({
                    opcode: BlockOpCode.OperatorLetterOf,
                    inputs: {
                        "LETTER": numberAmount.block,
                        "STRING": str.block,
                    }
                })
            }
        }
    }),

    getLengthOfString: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 1) errorMessages["Not enough arguments"](getFileData(fullExpr), "getLengthOfString", args.length, 1)

        let str = evaluate(args[0], parentID, OriginalSource);

        let key = uuid(includes.scratch_alphanumeric, 5);

        return {
            block: getBlockNumber(key),
            additionalBlocks: {
                ...str.additionalBlocks,
                [key]: block.createBlock({
                    opcode: BlockOpCode.OperatorLength,
                    inputs: {
                        "STRING": str.block,
                    }
                })
            }
        }
    }),

    stringContains: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 2) errorMessages["Not enough arguments"](getFileData(fullExpr), "stringContains", args.length, 2)

        let pattern = evaluate(args[0], parentID, OriginalSource);
        let str = evaluate(args[1], parentID, OriginalSource);

        let key = uuid(includes.scratch_alphanumeric, 5);

        return {
            block: getBlockNumber(key),
            additionalBlocks: {
                ...pattern.additionalBlocks,
                ...str.additionalBlocks,
                [key]: block.createBlock({
                    opcode: BlockOpCode.OperatorContains,
                    inputs: {
                        "STRING2": pattern.block,
                        "STRING1": str.block,
                    }
                })
            }
        }
    }),
}