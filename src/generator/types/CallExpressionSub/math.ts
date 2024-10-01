/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : math.ts
* Description       : Math library (types)
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { CallExpression } from "@babel/types";
import { BlockOpCode, buildData, typeData } from "../../../util/types";
import { BlockCluster, createBlock } from "../../../util/blocks";
import { includes, uuid } from "../../../util/scratch-uuid"
import { getBlockNumber, getScratchType, getVariable, ScratchType } from "../../../util/scratch-type"
import { Error } from "../../../util/err";
import { evaluate } from "../../../util/evaluate";

function createFunction(data: {
    minArgs: number,
    argTypes?: string[]
    doParse: boolean,
    body: (parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData: buildData) => void
}) {
    return ((callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData: buildData) => {
        if (callExpression.arguments.length < data.minArgs) {
            new Error("Not enough arguments", buildData.originalSource.substring(callExpression.loc?.start.index || 0, callExpression.loc?.end.index || 0), [{ line: callExpression.loc?.start.line || 1, column: callExpression.loc?.start.column || 1, length: (callExpression.loc?.end.column || 1) - (callExpression.loc?.start.column || 1) }], callExpression.loc?.filename || "")
        }

        let args: typeData[] = [];

        for (let i = 0; i < callExpression.arguments.length; i++) {
            let type = callExpression.arguments[i].type;
            if ((data.argTypes && data.argTypes[i] && data.argTypes[i] == type) || !data.argTypes || data.argTypes && !data.argTypes[i]) {
                if (!data.doParse) continue;

                args.push(
                    evaluate(type, blockCluster, callExpression.arguments[i], parentID, buildData)
                )
            } else if (data.argTypes && data.argTypes[i] && data.argTypes[i] != type) {
                new Error(`Expected '${data.argTypes[i]}' for argument '${i + 1}', got: '${type}'`, buildData.originalSource.substring(callExpression.loc?.start.index || 0, callExpression.loc?.end.index || 0), [{ line: callExpression.loc?.start.line || 1, column: callExpression.loc?.start.column || 1, length: (callExpression.loc?.end.column || 1) - (callExpression.loc?.start.column || 1) }], callExpression.loc?.filename || "")
            }
        }

        return data.body(args, callExpression, blockCluster, parentID, buildData);
    })
}

module.exports = {
    random: createFunction({
        minArgs: 2,
        doParse: true,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let key = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [key]: createBlock({
                    opcode: BlockOpCode.OperatorRandom,
                    inputs: {
                        "FROM": parsedArguments[0].block,
                        "TO": parsedArguments[1].block,
                    }
                })
            });

            return {
                isStaticValue: true,
                blockId: key,
                block: getBlockNumber(key)
            }
        })
    }),

    mod: createFunction({
        minArgs: 2,
        doParse: true,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let key = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [key]: createBlock({
                    opcode: BlockOpCode.OperatorMod,
                    inputs: {
                        "NUM1": parsedArguments[0].block,
                        "NUM2": parsedArguments[1].block,
                    }
                })
            });

            return {
                isStaticValue: true,
                blockId: key,
                block: getBlockNumber(key)
            }
        })
    }),

    round: createFunction({
        minArgs: 1,
        doParse: true,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let key = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [key]: createBlock({
                    opcode: BlockOpCode.OperatorRound,
                    inputs: {
                        "NUM": parsedArguments[0].block,
                    }
                })
            });

            return {
                isStaticValue: true,
                blockId: key,
                block: getBlockNumber(key)
            }
        })
    }),

    operation: createFunction({
        minArgs: 2,
        doParse: true,
        argTypes: ["StringLiteral"],
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
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
    
            let firstArg: any = callExpression.arguments[0];
            if (firstArg.type != "StringLiteral" || firstArg.value && !possibleOperators.includes(firstArg.value)) {
                firstArg = "abs"
            }
    
            if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value;
            }
            
            let key = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [key]: createBlock({
                    opcode: BlockOpCode.OperatorMathOp,
                    inputs: {
                        "NUM": parsedArguments[1].block,
                    },

                    fields: {
                        "OPERATOR": [
                            firstArg
                        ]
                    }
                })
            });

            return {
                isStaticValue: true,
                blockId: key,
                block: getBlockNumber(key)
            }
        })
    }),

    pi: createFunction({
        minArgs: 0,
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            return {
                isStaticValue: true,
                blockId: null,
                block: getScratchType(ScratchType.number, Math.PI)
            }
        })
    }),

    pow: createFunction({
        minArgs: 2,
        doParse: true,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let exponent = parsedArguments[1];
            let base = parsedArguments[0];
            
            let mainBlock = uuid(includes.scratch_alphanumeric, 16);
            let IDs = [
                uuid(includes.scratch_alphanumeric, 16),
                uuid(includes.scratch_alphanumeric, 16),
                uuid(includes.scratch_alphanumeric, 16),
                uuid(includes.scratch_alphanumeric, 16),
            ]
    
            blockCluster.addBlocks({
                [mainBlock]: createBlock({
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

                [IDs[0]]: createBlock({
                    opcode: BlockOpCode.OperatorMultiply,
                    parent: mainBlock,
                    inputs: {
                        "NUM1": exponent.block,
                        "NUM2": getBlockNumber(IDs[1])
                    }
                }),

                [IDs[1]]: createBlock({
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

                [IDs[2]]: createBlock({
                    opcode: BlockOpCode.OperatorMathOp,
                    parent: IDs[0],
                    inputs: {
                        "NUM": base.block
                    },

                    fields: {
                        "OPERATOR": [
                            "abs"
                        ]
                    }
                }),
            });

            return {
                isStaticValue: true,
                blockId: mainBlock,
                block: getBlockNumber(mainBlock)
            }
        })
    }),
}