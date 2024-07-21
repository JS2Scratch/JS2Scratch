/**
 * ShadowX
 * 
 * Part of the "JS2Scratch" Project
 * 
 * [2024]
 * [ Made with love <3 ]
 *
 * @lisence MIT
 * 
 * @description
 * Control blocks.
 */
;
import { evaluate } from "../../../util/evaluateValue";
import * as block from "../../../../../template/block";
import { BlockOpCode } from "../../../../../class/Sprite";
import { getMenu, getScratchType, ScratchType } from "../../../util/scratchType";
import * as babel from "@babel/parser";
import { errorMessages } from "../../../../../lib/console";
import { includes, uuid } from "../../../../../lib/scratch-uuid";

module.exports = {
    wait: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "wait", args.length, 1);
        let parsed = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.ControlWait,
                inputs: {
                    "DURATION": parsed.block
                }
            }),

            AdditionalBlocks: parsed.additionalBlocks
        }
    }),

    heartbeat: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "heartbeat", args.length, 1);

        let IDs = [
            uuid(includes.scratch_alphanumeric, 5),
            uuid(includes.scratch_alphanumeric, 5),
            uuid(includes.scratch_alphanumeric, 5),
            uuid(includes.scratch_alphanumeric, 5),
            uuid(includes.scratch_alphanumeric, 5),
            uuid(includes.scratch_alphanumeric, 5),
            uuid(includes.scratch_alphanumeric, 5),
        ]

        let endVarCode = uuid(includes.scratch_alphanumeric, 5);
        let endVar = [
            `end_${endVarCode}`,
            `end_${endVarCode}`,
        ]

        let evaluated = evaluate(args[0], IDs[3], OriginalSource);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.ControlRepeat,
                inputs: {
                    "TIMES": getScratchType(ScratchType.number, 1),
                    "SUBSTACK": [2, IDs[0]]
                }
            }),


            // Native codegen instead of function.
            // This was outsourced straight from scratch
            // and is auto generated.
            AdditionalBlocks: {
                ...evaluated.additionalBlocks,
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
                        "NUM1": evaluated.block,
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
            }
        }
    }),

    waitUntil: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "waitUntil", args.length, 1);
        args[0] = args[0] || { value: "" };

        let str = args[0].value;
        let astParsed = babel.parseExpression(str);
        let parsed = evaluate(astParsed, parentID, OriginalSource);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.ControlWaitUntil,
                inputs: {
                    "CONDITION": parsed.block
                }
            }),

            AdditionalBlocks: parsed.additionalBlocks
        }
    }),

    stop: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "stop", args.length, 1);
        
        let possibleValues = [
            "all",
            "this script",
            "other scripts in sprite"
        ];

        let firstArg = args[0];
        if (firstArg.type != "StringLiteral" || firstArg.value && !possibleValues.includes(firstArg.value)) {
            firstArg = "all";
        } else {
            firstArg = firstArg.value;
        }

        return {
            Block: block.createBlock({
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
            }),

            Terminate: firstArg != "other scripts in sprite"
        }
    }),

    clone: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "clone", args.length, 1)

        let firstArg = args[0];
        if (firstArg.type != "StringLiteral") {
            firstArg = "myself";
        } else {
            firstArg = firstArg.value;
        }

        if (firstArg == "myself") firstArg = "_myself_";

        let menuKey = uuid(includes.scratch_alphanumeric, 5);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.ControlCreateCloneOf,
                inputs: {
                    "CLONE_OPTION": getMenu(menuKey)
                },
            }),

            AdditionalBlocks: {
                [menuKey]: block.createBlock({
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
            }
        }
    }),

    deleteClone: (() => {
        return {
            Block: block.createBlock({
                opcode: BlockOpCode.ControlDeleteThisClone,
            }),

            Terminate: true,
        }
    }),
}