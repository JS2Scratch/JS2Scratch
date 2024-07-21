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
 * Array blocks.
 */
;
import { evaluate } from "../../../util/evaluateValue";
import * as block from "../../../../../template/block";
import { BlockOpCode } from "../../../../../class/Sprite";
import { getBlockNumber, getScratchType, ScratchType } from "../../../util/scratchType";
import { errorMessages } from "../../../../../lib/console";
import { ArrayExpression } from "@babel/types";
import { includes, uuid } from "../../../../../lib/scratch-uuid";

module.exports = {
    newList: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 2) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "new", args.length, 2);

        if (args[0].type != "StringLiteral") return;
        if (args[1].type != "ArrayExpression") return;

        let inputArr: ArrayExpression = args[1]
        let firstID = uuid(includes.scratch_alphanumeric);
        let blocks: any = {
            [firstID]: block.createBlock({
                opcode: BlockOpCode.DataDeleteAllOfList,
                parent: parentID,
                fields: {
                    "LIST": [
                        args[0].value,
                        args[0].value,
                    ]
                }
            })
        };
        let previousID = firstID;

        for (let i = 0; i < inputArr.elements.length; i++) {
            let newID = uuid(includes.scratch_alphanumeric, 5);
            let arrayObject = inputArr.elements[i];


            let evaluation = evaluate(arrayObject, newID, OriginalSource);

            blocks[previousID].next = newID;

            blocks = {
                ...blocks,
                ...evaluation.additionalBlocks,
                [newID]: block.createBlock({
                    opcode: BlockOpCode.DataAddToList,
                    parent: previousID,
                    inputs: {
                        "ITEM": evaluation.block
                    },
    
                    fields: {
                        "LIST": [
                            args[0].value,
                            args[0].value,
                        ]
                    }
                })
            }

            previousID = newID;
        }

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.ControlRepeat,
                inputs: {
                    "TIMES": getScratchType(ScratchType.number, 1),
                    "SUBSTACK": firstID == null ? undefined : [2, firstID]
                }
            }),

            AdditionalBlocks: blocks
        }
    }),

    push: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 2) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "push", args.length, 2);

        if (args[0].type != "StringLiteral") return;

        let evaluated = evaluate(args[1], parentID, OriginalSource);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.DataAddToList,
                parent: parentID,
                inputs: {
                    "ITEM": evaluated.block
                },

                fields: {
                    "LIST": [
                        args[0].value,
                        args[0].value,
                    ]
                }
            }),

            AdditionalBlocks: evaluated.additionalBlocks
        }
    }),

    pop: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "pop", args.length, 1);

        if (args[0].type != "StringLiteral") return;

        let lengthID = uuid(includes.scratch_alphanumeric, 5);
        return {
            Block: block.createBlock({
                opcode: BlockOpCode.DataDeleteOfList,
                inputs: {
                    "INDEX": getBlockNumber(lengthID)
                },
                
                fields: {
                    "LIST": [
                        args[0].value,
                        args[0].value,
                    ]
                }
            }),

            AdditionalBlocks: {
                [lengthID]: block.createBlock({
                    opcode: BlockOpCode.DataLengthOfList,
                    parent: parentID,
                    fields: {
                        "LIST": [
                        args[0].value,
                        args[0].value,
                    ]
                    }
                })
            }
        }
    }),

    shift: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "shift", args.length, 1);

        if (args[0].type != "StringLiteral") return;

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.DataDeleteOfList,
                inputs: {
                    "INDEX": getScratchType(ScratchType.number, 1)
                },
                
                fields: {
                    "LIST": [
                        args[0].value,
                        args[0].value,
                    ]
                }
            }),
        }
    }),

    clear: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "clear", args.length, 1);

        if (args[0].type != "StringLiteral") return;

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.DataDeleteAllOfList,
                fields: {
                    "LIST": [
                        args[0].value,
                        args[0].value,
                    ]
                }
            }),
        }
    }),

    insert: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 3) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "insert", args.length, 3);

        if (args[0].type != "StringLiteral") return;
        if (args[1].type != "NumericLiteral") return;

        let evaluatedIndex = evaluate(args[1], parentID, OriginalSource);
        let evaluatedItem = evaluate(args[2], parentID, OriginalSource);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.DataInsertAtList,
                inputs: {
                    "ITEM": evaluatedItem.block,
                    "INDEX": evaluatedIndex.block,

                },

                fields: {
                    "LIST": [
                        args[0].value,
                        args[0].value,
                    ]
                }
            }),

            AdditionalBlocks: {
                ...evaluatedIndex.additionalBlocks,
                ...evaluatedItem.additionalBlocks,
            }
        }
    }),

    deleteIndex: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 2) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "deleteIndex", args.length, 2);

        if (args[0].type != "StringLiteral") return;
        if (args[1].type != "NumericLiteral") return;

        let evaluatedIndex = evaluate(args[1], parentID, OriginalSource);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.DataDeleteOfList,
                inputs: {
                    "INDEX": evaluatedIndex.block,
                },

                fields: {
                    "LIST": [
                        args[0].value,
                        args[0].value,
                    ]
                }
            }),

            AdditionalBlocks: {
                ...evaluatedIndex.additionalBlocks,
            }
        }
    }),

    replace: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 3) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "replace", args.length, 3);

        if (args[0].type != "StringLiteral") return;
        if (args[1].type != "NumericLiteral") return;

        let evaluatedIndex = evaluate(args[1], parentID, OriginalSource);
        let evaluatedItem = evaluate(args[2], parentID, OriginalSource);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.DataReplaceItemOfList,
                inputs: {
                    "ITEM": evaluatedItem.block,
                    "INDEX": evaluatedIndex.block,

                },

                fields: {
                    "LIST": [
                        args[0].value,
                        args[0].value,
                    ]
                }
            }),

            AdditionalBlocks: {
                ...evaluatedIndex.additionalBlocks,
                ...evaluatedItem.additionalBlocks,
            }
        }
    }),

    show: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "clear", args.length, 1);

        if (args[0].type != "StringLiteral") return;

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.DataShowList,
                fields: {
                    "LIST": [
                        args[0].value,
                        args[0].value,
                    ]
                }
            }),
        }
    }),

    hide: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "clear", args.length, 1);

        if (args[0].type != "StringLiteral") return;

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.DataHideList,
                fields: {
                    "LIST": [
                        args[0].value,
                        args[0].value,
                    ]
                }
            }),
        }
    }),
}