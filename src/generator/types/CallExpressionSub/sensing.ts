/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : sensing.ts
* Description       : Sensing library (types)
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { CallExpression } from "@babel/types";
import { BlockOpCode, buildData, typeData } from "../../../util/types";
import { Error } from "../../../util/err";
import { evaluate } from "../../../util/evaluate";
import { BlockCluster, createBlock } from "../../../util/blocks";
import { includes, uuid } from "../../../util/scratch-uuid"
import { getBlockNumber, getMenu } from "../../../util/scratch-type"

let KEYS = [
    "space",
    "up arrow",
    "down arrow",
    "left arrow",
    "any",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
]

function createFunction(data: {
    minArgs: number,
    body: (parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => void
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

        return data.body(args, callExpression, blockCluster, parentID);
    })
}



module.exports = {
    touching: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            
            let firstArg: any = callExpression.arguments[0];
            if (firstArg.type != "StringLiteral") {
                firstArg = "edge"
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value;
            }

            if (firstArg == "edge" || firstArg == "mouse") {
                firstArg = `_${firstArg}_`;
            }

            let mainKey = uuid(includes.alphanumeric_with_symbols, 16);
            let menuKey = uuid(includes.alphanumeric_with_symbols, 16);

            blockCluster.addBlocks({
                [mainKey]: createBlock({
                    opcode: BlockOpCode.SensingTouchingObject,
                    inputs: {
                        "TOUCHINGOBJECTMENU": getMenu(menuKey)
                    }
                }),

                [menuKey]: createBlock({
                    opcode: BlockOpCode.SensingTouchingObjectMenu,
                    parent: mainKey,
                    fields: {
                        "TOUCHINGOBJECTMENU": [
                            firstArg,
                            null
                        ]
                    },
                    shadow: true
                })
            });

            return {
                isStaticValue: true,
                blockId: mainKey,
                block: getBlockNumber(mainKey)
            }
        })
    }),

    touchingColor: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let mainKey = uuid(includes.alphanumeric_with_symbols, 16);

            blockCluster.addBlocks({
                [mainKey]: createBlock({
                    opcode: BlockOpCode.SensingTouchingColor,
                    inputs: {
                        "COLOR": parsedArguments[0].block
                    }
                }),
            });

            return {
                isStaticValue: true,
                blockId: mainKey,
                block: getBlockNumber(mainKey)
            }
        })
    }),

    colorIsTouchingColor: createFunction({
        minArgs: 2,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let mainKey = uuid(includes.alphanumeric_with_symbols, 16);

            blockCluster.addBlocks({
                [mainKey]: createBlock({
                    opcode: BlockOpCode.SensingTouchingColor,
                    inputs: {
                        "COLOR": parsedArguments[0].block,
                        "COLOR2": parsedArguments[1].block,
                    }
                }),
            });

            return {
                isStaticValue: true,
                blockId: mainKey,
                block: getBlockNumber(mainKey)
            }
        })
    }),

    distanceTo: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            
            let firstArg: any = callExpression.arguments[0];
            if (firstArg.type != "StringLiteral") {
                firstArg = "mouse"
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value;
            }
    
            if (firstArg == "mouse") {
                firstArg = "_mouse_";
            }

            let mainKey = uuid(includes.alphanumeric_with_symbols, 16);
            let menuKey = uuid(includes.alphanumeric_with_symbols, 16);

            blockCluster.addBlocks({
                [mainKey]: createBlock({
                    opcode: BlockOpCode.SensingDistanceTo,
                    inputs: {
                        "DISTANCETOMENU": getMenu(menuKey)
                    }
                }),

                [menuKey]: createBlock({
                    opcode: BlockOpCode.SensingDistanceToMenu,
                    parent: mainKey,
                    fields: {
                        "DISTANCETOMENU": [
                            firstArg,
                            null
                        ]
                    },
                    shadow: true
                })
            });

            return {
                isStaticValue: true,
                blockId: mainKey,
                block: getBlockNumber(mainKey)
            }
        })
    }),

    mouseDown: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let mainKey = uuid(includes.alphanumeric_with_symbols, 16);

            blockCluster.addBlocks({
                [mainKey]: createBlock({
                    opcode: BlockOpCode.SensingMouseDown,
                }),
            });

            return {
                isStaticValue: true,
                blockId: mainKey,
                block: getBlockNumber(mainKey)
            }
        })
    }),

    keyDown: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let firstArg: any = callExpression.arguments[0];
            if (firstArg.type != "StringLiteral" || firstArg.value && !KEYS.includes(firstArg.value)) {
                firstArg = "space"
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value;
            }
    
            let mainKey = uuid(includes.alphanumeric_with_symbols, 16);
            let menuKey = uuid(includes.alphanumeric_with_symbols, 16);

            blockCluster.addBlocks({
                [mainKey]: createBlock({
                    opcode: BlockOpCode.SensingKeyPressed,
                    inputs: {
                        "KEY_OPTION": getMenu(menuKey)
                    }
                }),

                [menuKey]: createBlock({
                    opcode: BlockOpCode.SensingKeyOptions,
                    parent: mainKey,
                    fields: {
                        "KEY_OPTION": [
                            firstArg,
                            null
                        ]
                    },
                    shadow: true
                })
            });

            return {
                isStaticValue: true,
                blockId: mainKey,
                block: getBlockNumber(mainKey)
            }
        })
    }),

    itemOfObject: createFunction({
        minArgs: 2,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let firstArg: any = callExpression.arguments[0];
            let secondArg: any = callExpression.arguments[1];

            if (firstArg.type != "StringLiteral") {
                firstArg = "backdrop #"
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value;
            }
    
            if (secondArg.type != "StringLiteral") {
                secondArg = "stage"
            } else if (secondArg.type == "StringLiteral") {
                secondArg = secondArg.value;
            }
    
            if (secondArg == "stage") {
                secondArg = "_stage_";
            }
    
            let mainKey = uuid(includes.alphanumeric_with_symbols, 16);
            let menuKey = uuid(includes.alphanumeric_with_symbols, 16);

            blockCluster.addBlocks({
                [mainKey]: createBlock({
                    opcode: BlockOpCode.SensingOf,
                    inputs: {
                        "OBJECT": getMenu(menuKey)
                    },
                    fields: {
                        "PROPERTY": [
                            firstArg
                        ]
                    }
                }),

                [menuKey]: createBlock({
                    opcode: BlockOpCode.SensingOfObjectMenu,
                    parent: mainKey,
                    fields: {
                        "OBJECT": [
                            secondArg,
                            null
                        ]
                    },
                    shadow: true
                })
            });

            return {
                isStaticValue: true,
                blockId: mainKey,
                block: getBlockNumber(mainKey)
            }
        })
    }),

    current: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            
            let values = [
                "year",
                "month",
                "date",
                "day of week",
                "hour",
                "minute",
                "second"
            ]
            
            let firstArg: any = callExpression.arguments[0];
            if (firstArg.type != "StringLiteral" || firstArg.value && !values.includes(firstArg.value)) {
                firstArg = "year";
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value;
            }
    
            let mainKey = uuid(includes.alphanumeric_with_symbols, 16);

            blockCluster.addBlocks({
                [mainKey]: createBlock({
                    opcode: BlockOpCode.SensingCurrent,
                    fields: {
                        "CURRENTMENU": [
                            firstArg.toUpperCase().replace(/\s/g,'')
                        ]
                    }
                }),
            });

            return {
                isStaticValue: true,
                blockId: mainKey,
                block: getBlockNumber(mainKey)
            }
        })
    }),
}