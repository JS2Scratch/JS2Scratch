/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : method.ts
* Description       : Class library (types)
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 25/10/2024	saaawdust	Initial Creation
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
    get: createFunction({
        minArgs: 3,
        argTypes: ["StringLiteral", "StringLiteral", "StringLiteral"],
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, pd, bd) => {
            let base = uuid(includes.scratch_alphanumeric, 16);
            let add = uuid(includes.scratch_alphanumeric, 16);
            let top = uuid(includes.scratch_alphanumeric, 16);

            let listName = (callExpression.arguments[0] as StringLiteral).value + ".instances";
            let jsonFile = JSON.parse(readFileSync(join(__dirname, '../../../assets/classData.json')).toString());
            
            if (!jsonFile[(callExpression.arguments[0] as StringLiteral).value]) {
                new Error("Reference found to non-existant class", bd.originalSource, [ { line: callExpression.loc.start.line, column: callExpression.loc.start.column, length: 1 } ], callExpression.loc.filename).displayError();
            }
            
            let value = (jsonFile[(callExpression.arguments[0] as StringLiteral).value] as any).paramnames.indexOf((callExpression.arguments[2] as StringLiteral).value) + 1

            blockCluster.addBlocks({
                [add]: createBlock({
                    opcode: BlockOpCode.OperatorAdd,
                    inputs: {
                        "NUM1": getBlockNumber(base),
                        "NUM2": getScratchType(ScratchType.number, value),
                    },
                }),

                [top]: createBlock({
                    opcode: BlockOpCode.DataItemOfList,
                    inputs: {
                        "INDEX": getBlockNumber(add)
                    },

                    fields: {
                        "LIST": [
                            listName,
                            listName
                        ]
                    }
                }),

                [base]: createBlock({
                    opcode: BlockOpCode.DataItemNumOfList,
                    inputs: {
                        "ITEM": getScratchType(ScratchType.string, (callExpression.arguments[1] as StringLiteral).value),
                    },

                    fields: {
                        "LIST": [
                            listName,
                            listName
                        ]
                    }
                })
            });

            return {
                block: getBlockNumber(top),
                blockId: null,
                isStaticBlock: true
            }
        })
    }),

    instancesOf: createFunction({
        minArgs: 1,
        argTypes: ["StringLiteral"],
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, a: string, bd) => {
            let listName = (callExpression.arguments[0] as StringLiteral).value + ".instances";
            let base = uuid(includes.scratch_alphanumeric, 16);
            let div = uuid(includes.scratch_alphanumeric, 16);
            let pd = uuid(includes.scratch_alphanumeric, 16);

            let jsonFile = JSON.parse(readFileSync(join(__dirname, '../../../assets/classData.json')).toString());
            
            if (!jsonFile[(callExpression.arguments[0] as StringLiteral).value]) {
                new Error("Reference found to non-existant class", bd.originalSource, [ { line: callExpression.loc.start.line, column: callExpression.loc.start.column, length: 1 } ], callExpression.loc.filename).displayError();
            }

            blockCluster.addBlocks({
                [base]: createBlock({
                    opcode: BlockOpCode.DataLengthOfList,
                    parent: div,
                    fields: {
                        ["LIST"]: [
                            listName,
                            listName
                        ]
                    }
                }),

                [div]: createBlock({
                    opcode: BlockOpCode.OperatorDivide,
                    parent: pd,
                    inputs: {
                        ["NUM1"]: getBlockNumber(base),
                        ["NUM2"]: getScratchType(ScratchType.number, jsonFile[(callExpression.arguments[0] as StringLiteral).value].paramnames.length + 1)
                    }
                }),

                [pd]: createBlock({
                    opcode: BlockOpCode.OperatorRound,
                    inputs: {
                        ["NUM"]: getBlockNumber(div)
                    }
                })
            });

            return {
                block: getBlockNumber(pd),
                blockId: pd,
                isStaticBlock: true
            } 
        })
    }),
}