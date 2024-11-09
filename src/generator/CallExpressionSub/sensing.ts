/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : sensing.ts
* Description       : Sensing library (blocks)
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { CallExpression } from "@babel/types";
import { BlockOpCode, buildData, typeData } from "../../util/types";
import { BlockCluster, createBlock } from "../../util/blocks";
import { Error } from "../../util/err";
import { evaluate } from "../../util/evaluate";


function createFunction(data: {
    minArgs: number,
    body: (parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => void
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

        data.body(args, callExpression, blockCluster, parentID);
    })
}

module.exports = {
    ask: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.SensingAskAndWait,
                    inputs: {
                        "QUESTION": parsedArguments[0].block,
                    }
                })
            })
        })
    }),

    resetTimer: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.SensingResetTimer,
                })
            })
        })
    }),

    setDragMode: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let firstArg: any = callExpression.arguments[0];

            if (firstArg.type != "StringLiteral" || firstArg.value && firstArg.value != "draggable" && firstArg.value != "not draggable") {
                firstArg = "draggable";
            } else {
                firstArg = firstArg.value;
            }

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.SensingSetDragMode,

                    fields: {
                        "DRAG_MODE": [
                            firstArg,
                            null
                        ]
                    }
                })
            })
        })
    }),
}