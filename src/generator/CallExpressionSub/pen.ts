/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : pen.ts
* Description       : Pen library
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 4/10/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { CallExpression, stringLiteral } from "@babel/types";
import { BlockOpCode, buildData, typeData } from "../../util/types";
import { BlockCluster, createBlock } from "../../util/blocks";
import { includes, uuid } from "../../util/scratch-uuid"
import { getBlockNumber, getColor, getMenu, getScratchType, ScratchType } from "../../util/scratch-type"
import { Error } from "../../util/err";
import { evaluate } from "../../util/evaluate";
function createFunction(data: {
    minArgs: number,
    body: (parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData: buildData) => void
}) {
    return ((callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData: buildData) => {
        if (callExpression.arguments.length < data.minArgs) {
            new Error("Not enough arguments", buildData.originalSource, [{ line: callExpression.loc?.start.line || 1, column: callExpression.loc?.start.column || 1, length: (callExpression.loc?.end.column || 1) - (callExpression.loc?.start.column || 1) }], callExpression.loc?.filename || "")
        }

        let args: typeData[] = [];

        for (let i = 0; i < callExpression.arguments.length; i++) {
            args.push(
                evaluate(callExpression.arguments[i].type, blockCluster, callExpression.arguments[i], parentID, buildData)
            )
        }

        return data.body(args, callExpression, blockCluster, parentID, buildData);
    })
}

let graphicEffects: string[] = [
    "COLOR",
    "SATURATION",
    "BRIGHTNESS",
    "TRANSPARENCY"
];

module.exports = {
    clear: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.PenClear,
                }),
            })
        })
    }),

    stamp: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.PenStamp,
                }),
            })
        })
    }),

    down: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.PenPenDown,
                }),
            })
        })
    }),

    up: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.PenPenUp,
                }),
            })
        })
    }),

    changeEffect: createFunction({
        minArgs: 2,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let ID = uuid(includes.scratch_alphanumeric, 16);
            
            let firstArg: any = callExpression.arguments[0];
            if (firstArg.type != "StringLiteral" || firstArg.value && !graphicEffects.includes(firstArg.value.toUpperCase())) {
                firstArg = "COLOR"
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value;
            }

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.PenChangePenColorParamBy,
                    inputs: {
                        "COLOR_PARAM": getMenu(ID),
                        "VALUE": parsedArguments[1].block,
                    }
                }),

                [ID]: createBlock({
                    opcode: BlockOpCode.PenMenuColorParam,
                    fields: {
                        "colorParam": [
                            firstArg,
                            null
                        ]
                    }
                })
            })
        })
    }),

    setEffect: createFunction({
        minArgs: 2,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let ID = uuid(includes.scratch_alphanumeric, 16);
            
            let firstArg: any = callExpression.arguments[0];
            if (firstArg.type != "StringLiteral" || firstArg.value && !graphicEffects.includes(firstArg.value.toUpperCase())) {
                firstArg = "COLOR"
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value;
            }

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.PenSetPenColorParamTo,
                    inputs: {
                        "COLOR_PARAM": getMenu(ID),
                        "VALUE": parsedArguments[1].block,
                    }
                }),

                [ID]: createBlock({
                    opcode: BlockOpCode.PenMenuColorParam,
                    fields: {
                        "colorParam": [
                            firstArg,
                            null
                        ]
                    }
                })
            })
        })
    }),

    changeSize: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.PenChangePenSizeBy,
                    inputs: {
                        "SIZE": parsedArguments[0].block,
                    }
                }),
            })
        })
    }),

    setSize: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.PenSetPenSizeTo,
                    inputs: {
                        "SIZE": parsedArguments[0].block,
                    }
                }),
            })
        })
    }),

    setColor: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.PenSetPenColorToColor,
                    inputs: {
                        "COLOR": parsedArguments[0].block
                    }
                }),
            })
        })
    }),
}