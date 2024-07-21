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
import { getBlockNumber, getScratchType, ScratchType } from "../../../util/scratchType";
import { errorMessages } from "../../../../../lib/console";
import { includes, uuid } from "../../../../../lib/scratch-uuid";

function getFileData(expr: any): string {
    return `file: ${expr.callee.loc.filename} line: ${expr.callee.loc.start.line} column: ${expr.callee.loc.start.column}`;
}

module.exports = {
    random: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 2) errorMessages["Not enough arguments"](getFileData(fullExpr), "random", args.length, 2)

        let evalLeft = evaluate(args[0], parentID, OriginalSource);
        let evalRight = evaluate(args[1], parentID, OriginalSource);
        let mainBlock = uuid(includes.scratch_alphanumeric, 5);

        return {
            block: getBlockNumber(mainBlock),
            additionalBlocks: {
                ...evalLeft.additionalBlocks,
                ...evalRight.additionalBlocks,
                [mainBlock]: block.createBlock({
                    opcode: BlockOpCode.OperatorRandom,
                    inputs: {
                        "FROM": evalLeft.block,
                        "TO": evalRight.block,
                    }
                })
            }
        }
    }),

    mod: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 2) errorMessages["Not enough arguments"](getFileData(fullExpr), "mod", args.length, 2)

        let evalLeft = evaluate(args[0], parentID, OriginalSource);
        let evalRight = evaluate(args[1], parentID, OriginalSource);
        let mainBlock = uuid(includes.scratch_alphanumeric, 5);

        return {
            block: getBlockNumber(mainBlock),
            additionalBlocks: {
                ...evalLeft.additionalBlocks,
                ...evalRight.additionalBlocks,
                [mainBlock]: block.createBlock({
                    opcode: BlockOpCode.OperatorMod,
                    inputs: {
                        "NUM1": evalLeft.block,
                        "NUM2": evalRight.block,
                    }
                })
            }
        }
    }),

    round: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 1) errorMessages["Not enough arguments"](getFileData(fullExpr), "round", args.length, 1)

        let evalLeft = evaluate(args[0], parentID, OriginalSource);
        let mainBlock = uuid(includes.scratch_alphanumeric, 5);

        return {
            block: getBlockNumber(mainBlock),
            additionalBlocks: {
                ...evalLeft.additionalBlocks,
                [mainBlock]: block.createBlock({
                    opcode: BlockOpCode.OperatorRound,
                    inputs: {
                        "NUM": evalLeft.block,
                    }
                })
            }
        }
    }),

    operation: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 2) errorMessages["Not enough arguments"](getFileData(fullExpr), "operation", args.length, 2)

        let possibleOperators = [
            "abs",
            "floor",
            "ceiling",
            "sqrt",
            "sin",
            "cos",
            "tan",
            "asin",
            "atan",
            "in",
            "log",
            "e ^",
            "10 ^"
        ]

        let firstArg = args[0];
        if (firstArg.type != "StringLiteral" || firstArg.value && !possibleOperators.includes(firstArg.value)) {
            firstArg = "abs"
        }

        if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value;
        }

        let evalRight = evaluate(args[1], parentID, OriginalSource);
        let mainBlock = uuid(includes.scratch_alphanumeric, 5);

        return {
            block: getBlockNumber(mainBlock),
            additionalBlocks: {
                ...evalRight.additionalBlocks,
                [mainBlock]: block.createBlock({
                    opcode: BlockOpCode.OperatorMathOp,
                    inputs: {
                        "NUM": evalRight.block,
                    },

                    fields: {
                        "OPERATOR": [
                            firstArg
                        ]
                    }
                })
            }
        }
    }),

    pi: (() => {
        let mainBlock = uuid(includes.scratch_alphanumeric, 5);

        return {
            block: getBlockNumber(mainBlock),
            additionalBlocks: {
                [mainBlock]: block.createBlock({
                    opcode: BlockOpCode.OperatorAdd,
                    inputs: {
                        "NUM1": getScratchType(ScratchType.number, Math.PI),
                        "NUM2": getScratchType(ScratchType.number, 0),
                    },
                })
            }
        }
    }),

    pow: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 2) errorMessages["Not enough arguments"](getFileData(fullExpr), "pow", args.length, 2)

        // Number
        let evalLeft = evaluate(args[0], parentID, OriginalSource);

        // Power / Exponent
        let evalRight = evaluate(args[1], parentID, OriginalSource);
        let mainBlock = uuid(includes.scratch_alphanumeric, 5);

        let IDs = [
            uuid(includes.scratch_alphanumeric, 5),
            uuid(includes.scratch_alphanumeric, 5),
            uuid(includes.scratch_alphanumeric, 5),
            uuid(includes.scratch_alphanumeric, 5),

        ]

        return {
            block: getBlockNumber(mainBlock),
            additionalBlocks: {
                ...evalLeft.additionalBlocks,
                ...evalRight.additionalBlocks,
                [mainBlock]: block.createBlock({
                    opcode: BlockOpCode.OperatorMathOp,
                    parent: parentID,
                    inputs: {
                        "NUM": getBlockNumber(IDs[0])
                    },

                    fields: {
                        "OPERATOR": [
                            "10 ^"
                        ]
                    }
                }),

                [IDs[0]]: block.createBlock({
                    opcode: BlockOpCode.OperatorMultiply,
                    parent: mainBlock,
                    inputs: {
                        "NUM1": evalRight.block,
                        "NUM2": getBlockNumber(IDs[1])
                    }
                }),

                [IDs[1]]: block.createBlock({
                    opcode: BlockOpCode.OperatorMathOp,
                    parent: IDs[0],
                    inputs: {
                        "NUM": getBlockNumber(IDs[2])
                    },

                    fields: {
                        "OPERATOR": [
                            "log"
                        ]
                    }
                }),

                [IDs[2]]: block.createBlock({
                    opcode: BlockOpCode.OperatorMathOp,
                    parent: IDs[0],
                    inputs: {
                        "NUM": evalLeft.block
                    },

                    fields: {
                        "OPERATOR": [
                            "abs"
                        ]
                    }
                }),
            },
            
        }
    }),
}