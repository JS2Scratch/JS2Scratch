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
 * List blocks.
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
    getItemOfList: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 2) errorMessages["Not enough arguments"](getFileData(fullExpr), "getItemOfList", args.length, 2)

        let firstArg = args[0];
        if (firstArg.type != "StringLiteral") return;

        let key = uuid(includes.scratch_alphanumeric, 5);
        let index = evaluate(args[1], parentID, OriginalSource);

        return {
            block: getBlockNumber(key),
            additionalBlocks: {
                ...index.additionalBlocks,
                [key]: block.createBlock({
                    opcode: BlockOpCode.DataItemOfList,
                    parent: parentID,
                    inputs: {
                        "INDEX": index.block
                    },
                    fields: {
                        "LIST": [
                            firstArg.value,
                            firstArg.value,
                        ]
                    }
                })
            }
        }
    }),

    getItemIndexInList: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 2) errorMessages["Not enough arguments"](getFileData(fullExpr), "getItemIndexInList", args.length, 2)

        let firstArg = args[0];
        if (firstArg.type != "StringLiteral") return;

        let key = uuid(includes.scratch_alphanumeric, 5);
        let index = evaluate(args[1], parentID, OriginalSource);
        
        return {
            block: getBlockNumber(key),
            additionalBlocks: {
                ...index.additionalBlocks,
                [key]: block.createBlock({
                    opcode: BlockOpCode.DataItemNumOfList,
                    parent: parentID,
                    inputs: {
                        "ITEM": index.block
                    },
                    fields: {
                        "LIST": [
                            firstArg.value,
                            firstArg.value,
                        ]
                    }
                })
            }
        }
    }),

    lengthOfList: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 1) errorMessages["Not enough arguments"](getFileData(fullExpr), "lengthOfList", args.length, 1)

        let firstArg = args[0];
        if (firstArg.type != "StringLiteral") return;

        let key = uuid(includes.scratch_alphanumeric, 5);
        
        return {
            block: getBlockNumber(key),
            additionalBlocks: {
                [key]: block.createBlock({
                    opcode: BlockOpCode.DataLengthOfList,
                    parent: parentID,
                    fields: {
                        "LIST": [
                            firstArg.value,
                            firstArg.value,
                        ]
                    }
                })
            }
        }
    }),

    listContainsItem: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 2) errorMessages["Not enough arguments"](getFileData(fullExpr), "getItemOfList", args.length, 2)

        let firstArg = args[0];
        if (firstArg.type != "StringLiteral") return;

        let key = uuid(includes.scratch_alphanumeric, 5);
        let index = evaluate(args[1], parentID, OriginalSource);

        return {
            block: getBlockNumber(key),
            additionalBlocks: {
                ...index.additionalBlocks,
                [key]: block.createBlock({
                    opcode: BlockOpCode.DataListContainsItem,
                    parent: parentID,
                    inputs: {
                        "ITEM": index.block
                    },
                    fields: {
                        "LIST": [
                            firstArg.value,
                            firstArg.value,
                        ]
                    }
                })
            }
        }
    }),
}