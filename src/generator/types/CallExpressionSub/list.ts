/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : list.ts
* Description       : List library (types)
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
import { getBlockNumber } from "../../../util/scratch-type"
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
    getItem: createFunction({
        minArgs: 2,
        doParse: true,
        argTypes: ["StringLiteral"],
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let args = callExpression.arguments;
            let firstArg: any = args[0];
            let key = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [key]: createBlock({
                    opcode: BlockOpCode.DataItemOfList,
                    parent: parentID,
                    inputs: {
                        "INDEX": parsedArguments[1].block
                    },
                    fields: {
                        "LIST": [
                            firstArg.value,
                            firstArg.value,
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

    getItemIndex: createFunction({
        minArgs: 2,
        doParse: true,
        argTypes: ["StringLiteral"],
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let args = callExpression.arguments;
            let firstArg: any = args[0];
            let key = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [key]: createBlock({
                    opcode: BlockOpCode.DataItemNumOfList,
                    parent: parentID,
                    inputs: {
                        "ITEM": parsedArguments[1].block
                    },
                    fields: {
                        "LIST": [
                            firstArg.value,
                            firstArg.value,
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

    length: createFunction({
        minArgs: 1,
        doParse: false,
        argTypes: ["StringLiteral"],
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let args = callExpression.arguments;
            let firstArg: any = args[0];
            let key = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [key]: createBlock({
                    opcode: BlockOpCode.DataLengthOfList,
                    parent: parentID,
                    fields: {
                        "LIST": [
                            firstArg.value,
                            firstArg.value,
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

    contains: createFunction({
        minArgs: 2,
        doParse: true,
        argTypes: ["StringLiteral"],
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let args = callExpression.arguments;
            let firstArg: any = args[0];
            let key = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [key]: createBlock({
                    opcode: BlockOpCode.DataListContainsItem,
                    parent: parentID,
                    inputs: {
                        "ITEM": parsedArguments[1].block
                    },
                    fields: {
                        "LIST": [
                            firstArg.value,
                            firstArg.value,
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
}