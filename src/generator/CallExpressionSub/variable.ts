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

import { CallExpression, StringLiteral } from "@babel/types";
import { BlockOpCode, buildData, typeData } from "../../util/types";
import { BlockCluster, createBlock } from "../../util/blocks";
import { Error } from "../../util/err";
import { evaluate } from "../../util/evaluate";


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

        data.body(args, callExpression, blockCluster, parentID, buildData);
    })
}

module.exports = {
    show: createFunction({
        minArgs: 1,
        argTypes: ["StringLiteral"],
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let value = (callExpression.arguments[0] as StringLiteral).value;
            
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.DataShowVariable,
                    fields: {
                        "VARIABLE": [
                            value,
                            value
                        ],
                    }
                })
            })
        })
    }),

    hide: createFunction({
        minArgs: 1,
        argTypes: ["StringLiteral"],
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let value = (callExpression.arguments[0] as StringLiteral).value;
            
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.DataHideVariable,
                    fields: {
                        "VARIABLE": [
                            value,
                            value
                        ],
                    }
                })
            })
        })
    }),
}