/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : looks.ts
* Description       : Looks library (types)
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 19/10/2024	saaawdust	Initial Creation
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
            new Error("Not enough arguments", buildData.originalSource, [{ line: callExpression.loc?.start.line || 1, column: callExpression.loc?.start.column || 1, length: (callExpression.loc?.end.column || 1) - (callExpression.loc?.start.column || 1) }], callExpression.loc?.filename || "")
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
                new Error(`Expected '${data.argTypes[i]}' for argument '${i + 1}', got: '${type}'`, buildData.originalSource, [{ line: callExpression.loc?.start.line || 1, column: callExpression.loc?.start.column || 1, length: (callExpression.loc?.end.column || 1) - (callExpression.loc?.start.column || 1) }], callExpression.loc?.filename || "")
            }
        }

        return data.body(args, callExpression, blockCluster, parentID, buildData);
    })
}

module.exports = {
    size: createFunction({
        minArgs: 0,
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster) => {
            let key = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [key]: createBlock({
                    opcode: BlockOpCode.LooksSize,
                })
            });

            return {
                isStaticValue: true,
                blockId: key,
                block: getBlockNumber(key)
            }
        })
    }),

    costumeIndex: createFunction({
        minArgs: 0,
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster) => {
            let newKey = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [newKey]: createBlock({
                    opcode: BlockOpCode.LooksCostumeNumberName,

                    fields: {
                        "NUMBER_NAME": [
                            "number",
                            null
                        ]
                    }
                })
            })

            return {
                block: getBlockNumber(newKey),
                blockId: null,
                isStaticBlock: true
            }
        })
    }),
    
    costumeName: createFunction({
        minArgs: 0,
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster) => {
            let newKey = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [newKey]: createBlock({
                    opcode: BlockOpCode.LooksCostumeNumberName,

                    fields: {
                        "NUMBER_NAME": [
                            "name",
                            null
                        ]
                    }
                })
            })

            return {
                block: getBlockNumber(newKey),
                blockId: null,
                isStaticBlock: true
            }
        })
    }),

    backdropIndex: createFunction({
        minArgs: 0,
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster) => {
            let newKey = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [newKey]: createBlock({
                    opcode: BlockOpCode.LooksBackdropNumberName,

                    fields: {
                        "NUMBER_NAME": [
                            "number",
                            null
                        ]
                    }
                })
            })

            return {
                block: getBlockNumber(newKey),
                blockId: null,
                isStaticBlock: true
            }
        })
    }),
    
    backdropName: createFunction({
        minArgs: 0,
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster) => {
            let newKey = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [newKey]: createBlock({
                    opcode: BlockOpCode.LooksBackdropNumberName,

                    fields: {
                        "NUMBER_NAME": [
                            "name",
                            null
                        ]
                    }
                })
            })

            return {
                block: getBlockNumber(newKey),
                blockId: null,
                isStaticBlock: true
            }
        })
    }),
}