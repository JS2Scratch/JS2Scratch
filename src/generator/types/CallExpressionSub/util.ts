/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : util.ts
* Description       : Utility library (types)
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 09/11/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { CallExpression, NumericLiteral, StringLiteral } from "@babel/types";
import { BlockOpCode, buildData, typeData } from "../../../util/types";
import { BlockCluster, createBlock } from "../../../util/blocks";
import { includes, uuid } from "../../../util/scratch-uuid"
import { getBlockNumber, getScratchType, getVariable, ScratchType } from "../../../util/scratch-type"
import { Error } from "../../../util/err";
import { evaluate } from "../../../util/evaluate";
import { readFileSync } from "fs";
import { join } from "path";

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
    getReturnAddress: createFunction({
        minArgs: 1,
        argTypes: ["StringLiteral"],
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, pd, bd) => {
            let jsonFile = JSON.parse(readFileSync(join(__dirname, '../../../assets/fn.json')).toString());
            let strValue = (callExpression.arguments[0] as StringLiteral).value;

            if (!jsonFile[strValue]) {
                new Error("Reference found to non-existant function", bd.originalSource, [ { line: callExpression.loc.start.line, column: callExpression.loc.start.column, length: 1 } ], callExpression.loc.filename).displayError();
            }

            return {
                block: getVariable(jsonFile[strValue].retCode),
                blockId: null,
                isStaticBlock: true
            }
        })
    }),
}