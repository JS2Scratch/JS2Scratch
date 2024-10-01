/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : operation.ts
* Description       : Operation library
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
    body: (parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData: buildData) => void
}) {
    return ((callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData: buildData) => {
        if (callExpression.arguments.length < data.minArgs) {
            new Error("Not enough arguments", buildData.originalSource.substring(callExpression.loc?.start.index || 0, callExpression.loc?.end.index || 0), [{ line: callExpression.loc?.start.line || 1, column: callExpression.loc?.start.column || 1, length: (callExpression.loc?.end.column || 1) - (callExpression.loc?.start.column || 1) }], callExpression.loc?.filename || "")
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

module.exports = {
    join: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let args = callExpression.arguments;
            let leftKey = uuid(includes.scratch_alphanumeric, 16);
            let leftOperand = evaluate(args[0].type, blockCluster, args[0], leftKey, buildData);

            args.forEach((arg, index) => {
                let newJoinBlockId = uuid(includes.scratch_alphanumeric, 16);
                let rightOperand = evaluate(arg.type, blockCluster, arg, leftKey, buildData);

                blockCluster.addBlocks({
                    [newJoinBlockId]: createBlock({
                        opcode: BlockOpCode.OperatorJoin,
                        parent: parentID,
                        inputs: {
                            // Use the evaluated left operand for the first iteration, 
                            // otherwise use the previous join block's ID
                            "STRING1": (index === 1) ? leftOperand.block : getBlockNumber(leftKey),
                            "STRING2": rightOperand.block,
                        }
                    })
                });

                // Update leftKey for the next iteration to chain joins!!
                leftKey = newJoinBlockId;
            });

            return {
                isStaticValue: true,
                blockId: leftKey,
                block: getBlockNumber(leftKey)
            }
        })
    }),

    getLetterOfString: createFunction({
        minArgs: 2,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            
            let ID = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [ID]: createBlock({
                    opcode: BlockOpCode.OperatorLetterOf,
                    inputs: {
                        "LETTER": parsedArguments[0].block,
                        "STRING": parsedArguments[1].block
                    }
                })
            });

            return {
                isStaticValue: true,
                blockId: ID,
                block: getBlockNumber(ID)
            }
        })
    }),

    getLengthOfString: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            
            let ID = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [ID]: createBlock({
                    opcode: BlockOpCode.OperatorLength,
                    inputs: {
                        "STRING": parsedArguments[0].block,
                    }
                })
            });

            return {
                isStaticValue: true,
                blockId: ID,
                block: getBlockNumber(ID)
            }
        })
    }),

    stringContains: createFunction({
        minArgs: 2,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            
            let ID = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [ID]: createBlock({
                    opcode: BlockOpCode.OperatorContains,
                    inputs: {
                        "STRING2": parsedArguments[0].block,
                        "STRING1": parsedArguments[1].block,
                    }
                })
            });

            return {
                isStaticValue: true,
                blockId: ID,
                block: getBlockNumber(ID)
            }
        })
    }),
}