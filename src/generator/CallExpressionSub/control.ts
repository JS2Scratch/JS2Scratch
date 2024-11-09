/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : control.ts
* Description       : Control library
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { CallExpression, stringLiteral } from "@babel/types";
import { BlockOpCode, buildData, typeData } from "../../util/types";
import { BlockCluster, createBlock } from "../../util/blocks";
import { includes, uuid } from "../../util/scratch-uuid"
import { getBlockNumber, getMenu, getScratchType, ScratchType } from "../../util/scratch-type"
import { Error } from "../../util/err";
import { evaluate } from "../../util/evaluate";
import * as babel from "@babel/parser";

function isComparisonOperator(value: string) {
    const operators = [">", "<", "==", "===", "!=", "!=="];
    return operators.includes(value);
}

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

module.exports = {
    wait: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.ControlWait,
                    inputs: {
                        "DURATION": parsedArguments[0].block
                    }
                }),
            })
        })
    }),

    waitUntil: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let firstArg = callExpression.arguments[0];

            if (firstArg.type != "StringLiteral") {
                firstArg = stringLiteral("");
            }

            // isSpikyType((LogicalExpression as any).right.callee.object.name, (LogicalExpression as any).right.callee.property.name))
            // &&
            //     && isComparisonOperator(babelParsed.operator))


            let babelParsed = babel.parseExpression(firstArg.value)
            let extra: { [key: string]: any } = {};
            let id = uuid(includes.scratch_alphanumeric, 16);
            let evaluated: any;

            if (
                babelParsed.type != "LogicalExpression" &&
                babelParsed.type != "BooleanLiteral" &&
                !(babelParsed.type == "BinaryExpression" && isComparisonOperator(babelParsed.operator)) &&
                !(babelParsed.type == "UnaryExpression" && babelParsed.operator == "!")
            ) {
                new Error(
                    "Cannot resolve logical expression",
                    firstArg.value == "" && "No Logical expression was provided!" || firstArg.value,
                    [{ line: callExpression.arguments[0].loc?.start.line || 1, column: callExpression.arguments[0].loc?.start.column || 1, length: firstArg.value.length, displayColumn: 1 }],
                    callExpression.loc?.filename || ""
                ).displayError()
            }

            evaluated = evaluate(babelParsed.type, blockCluster, babelParsed, id, buildData).block;

            // if (babelParsed.type == "LogicalExpression" || babelParsed.type == "BooleanLiteral") {
            //     evaluated = evaluate(babelParsed.type, blockCluster, babelParsed, id, buildData).block;
            // } else if (babelParsed.type == "BinaryExpression") {
            //     let sId = uuid(includes.scratch_alphanumeric, 16)
            //     extra[sId] = createBlock({
            //         opcode: BlockOpCode.OperatorEquals,
            //         parent: id,
            //         inputs: {
            //             "OPERAND1": evaluated,
            //             "OPERAND2": getScratchType(ScratchType.number, "1")
            //         }
            //     });

            //     evaluated = getBlockNumber(sId);
            // } else if (babelParsed.type == "UnaryExpression") {
            //     let sId = uuid(includes.scratch_alphanumeric, 16)
                
            // }

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.ControlWaitUntil,
                    inputs: {
                        "CONDITION": evaluated
                    }
                }),

                ...extra
            })
        })
    }),

    stop: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let firstArg: any = callExpression.arguments[0];

            let possibleValues = [
                "all",
                "this script",
                "other scripts in sprite"
            ];

            if (firstArg.type != "StringLiteral" || firstArg.value && !possibleValues.includes(firstArg.value)) {
                firstArg = "all";
            } else {
                firstArg = firstArg.value;
            }

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.ControlStop,
                    fields: {
                        "STOP_OPTION": [
                            firstArg
                        ]
                    },

                    mutation: {
                        tagName: "mutation",
                        children: [],
                        hasnext: String(firstArg == "other scripts in sprite")
                    }
                })
            })

            return { terminate: firstArg != "other scripts in sprite" }
        })
    }),

    clone: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let firstArg: any = callExpression.arguments[0];

            if (firstArg.type != "StringLiteral") {
                firstArg = "myself";
            } else {
                firstArg = firstArg.value;
            }

            if (firstArg == "myself") firstArg = "_myself_";

            let menuKey = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.ControlCreateCloneOf,
                    inputs: {
                        "CLONE_OPTION": getMenu(menuKey)
                    },
                }),

                [menuKey]: createBlock({
                    opcode: BlockOpCode.ControlCreateCloneOfMenu,
                    parent: parentID,
                    fields: {
                        "CLONE_OPTION": [
                            firstArg,
                            null
                        ]
                    },
                    shadow: true
                })
            })

            return {  }
        })
    }),

    deleteClone: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.ControlDeleteThisClone,
                }),
            })

            return { terminate: true }
        })
    }),

    heartbeat: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {

            let IDs: string[] = [
                parentID,
                uuid(includes.scratch_alphanumeric, 16),
                uuid(includes.scratch_alphanumeric, 16),
                uuid(includes.scratch_alphanumeric, 16),
                uuid(includes.scratch_alphanumeric, 16),
                uuid(includes.scratch_alphanumeric, 16),
                uuid(includes.scratch_alphanumeric, 16),
            ];

            // The only time we do this.
            let endVarCode = uuid(includes.scratch_alphanumeric, 5);
            let endVar = [
                `end_${endVarCode}`,
                `end_${endVarCode}`,
            ]

            // Native-code-generation.
            // This doesn't use `createBlock`, but instead
            // is taken straight from an .SB3 file! It CANNOT
            // be more optimized!
            blockCluster.addBlocks(({
                [IDs[0]]: {
                    "opcode": "data_setvariableto",
                    "next": IDs[4],
                    "parent": parentID,
                    "inputs": {
                        "VALUE": [
                            3,
                            IDs[3],
                            [
                                10,
                                "0"
                            ]
                        ]
                    },
                    "fields": {
                        "VARIABLE": endVar
                    },
                    "shadow": false,
                    "topLevel": false
                },
                [IDs[1]]: {
                    "opcode": "operator_divide",
                    "next": null,
                    "parent": IDs[3],
                    "inputs": {
                        "NUM1": parsedArguments[0].block,
                        "NUM2": [
                            1,
                            [
                                4,
                                "86400"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                [IDs[2]]: {
                    "opcode": "sensing_dayssince2000",
                    "next": null,
                    "parent": IDs[3],
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                [IDs[3]]: {
                    "opcode": "operator_add",
                    "next": null,
                    "parent": IDs[0],
                    "inputs": {
                        "NUM1": [
                            3,
                            IDs[1],
                            [
                                4,
                                ""
                            ]
                        ],
                        "NUM2": [
                            3,
                            IDs[2],
                            [
                                4,
                                ""
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                [IDs[4]]: {
                    "opcode": "control_wait_until",
                    "parent": IDs[0],
                    "inputs": {
                        "CONDITION": [
                            2,
                            IDs[6]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                [IDs[5]]: {
                    "opcode": "sensing_dayssince2000",
                    "next": null,
                    "parent": IDs[6],
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                [IDs[6]]: {
                    "opcode": "operator_gt",
                    "next": null,
                    "parent": IDs[4],
                    "inputs": {
                        "OPERAND1": [
                            3,
                            IDs[5],
                            [
                                10,
                                ""
                            ]
                        ],
                        "OPERAND2": [
                            3,
                            [
                                12,
                                endVar[0],
                                endVar[0]
                            ],
                            [
                                10,
                                "50"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
            } as any))
        })
    })
}