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
import { BlockOpCode, buildData, typeData } from "../../util/types";
import { BlockCluster, createBlock } from "../../util/blocks";
import { includes, uuid } from "../../util/scratch-uuid"
import { getBlockNumber, getScratchType, getSubstack, getVariable, ScratchType } from "../../util/scratch-type"
import { Error } from "../../util/err";
import { evaluate } from "../../util/evaluate";
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
                new Error(`Expected '${data.argTypes[i]}' for argument '${i + 1}', got: '${type}'`, (buildData.originalSource || "").substring(callExpression.loc?.start.index || 0, callExpression.loc?.end.index || 0), [{ line: callExpression.loc?.start.line || 1, column: callExpression.loc?.start.column || 1, length: (callExpression.loc?.end.column || 1) - (callExpression.loc?.start.column || 1) }], callExpression.loc?.filename || "")
            }
        }

        return data.body(args, callExpression, blockCluster, parentID, buildData);
    })
}

module.exports = {
    cleanup: createFunction({
        minArgs: 1,
        argTypes: ["StringLiteral"],
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.DataDeleteAllOfList,
                    fields: {
                        ["LIST"]: [
                            (callExpression.arguments[0] as StringLiteral).value + ".instances"
                        ]
                    }
                })
            });
        })
    }),

    set: createFunction({
        minArgs: 4,
        argTypes: ["StringLiteral", "StringLiteral", "StringLiteral"],
        doParse: true,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, bd) => {
            let base = uuid(includes.scratch_alphanumeric, 16);
            let add = uuid(includes.scratch_alphanumeric, 16);

            let listName = (callExpression.arguments[0] as StringLiteral).value + ".instances";
            let jsonFile = JSON.parse(readFileSync(join(__dirname, '../../assets/classData.json')).toString());
            
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

                [parentID]: createBlock({
                    opcode: BlockOpCode.DataReplaceItemOfList,
                    inputs: {
                        "ITEM": parsedArguments[3].block,
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
        })
    }),

    destroy: createFunction({
        minArgs: 2,
        argTypes: ["StringLiteral", "StringLiteral"],
        doParse: true,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let listName = (callExpression.arguments[0] as StringLiteral).value + ".instances";
            let tmpName = uuid(includes.alphanumeric, 5);

            let ids = [
                uuid(includes.scratch_alphanumeric, 16),
                uuid(includes.scratch_alphanumeric, 16),
                uuid(includes.scratch_alphanumeric, 16),
                uuid(includes.scratch_alphanumeric, 16),
                uuid(includes.scratch_alphanumeric, 16),
            ];

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.ControlRepeat,
                    inputs: {
                        "TIMES": getScratchType(ScratchType.number, 1),
                        "SUBSTACK": getSubstack(ids[0])
                    }
                }),

                [ids[0]]: createBlock({
                    opcode: BlockOpCode.DataSetVariableTo,
                    next: ids[2],
                    inputs: {
                        "VALUE": getBlockNumber(ids[1])
                    },
                    fields: {
                        "VARIABLE": [
                            tmpName,
                            tmpName
                        ]
                    }
                }),

                [ids[1]]: createBlock({
                    opcode: BlockOpCode.DataItemNumOfList,
                    parent: ids[0],
                    inputs: {
                        "ITEM": getScratchType(ScratchType.string, (callExpression.arguments[1] as StringLiteral).value)
                    },
                    fields: {
                        "LIST": [
                            listName,
                            listName,
                        ]
                    }
                }),

                [ids[2]]: createBlock({
                    opcode: BlockOpCode.DataDeleteOfList,
                    next: ids[3],
                    inputs: {
                        "INDEX": getVariable(tmpName)
                    },

                    fields: {
                        "LIST": [
                            listName,
                            listName,
                        ]
                    }
                }),

                [ids[3]]: createBlock({
                    opcode: BlockOpCode.ControlRepeat,
                    inputs: {
                        "TIMES": getScratchType(ScratchType.number, JSON.parse(readFileSync(join(__dirname, '../../assets/classData.json')).toString())[(callExpression.arguments[0] as StringLiteral).value].params.length), // CHANGE THIS TO THE ACTUAL VALUE!
                        "SUBSTACK": getSubstack(ids[4])
                    }
                }),

                [ids[4]]: createBlock({
                    opcode: BlockOpCode.DataDeleteOfList,
                    inputs: {
                        "INDEX": getVariable(tmpName)
                    },

                    fields: {
                        "LIST": [
                            listName,
                            listName,
                        ]
                    }
                })
            });
        })
    }),
}