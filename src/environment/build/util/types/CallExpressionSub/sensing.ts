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
 * Sensing blocks.
 */
;
import { evaluate } from "../../../util/evaluateValue";
import * as block from "../../../../../template/block";
import { BlockOpCode } from "../../../../../class/Sprite";
import { getBlockNumber, getMenu } from "../../../util/scratchType";
import { errorMessages } from "../../../../../lib/console";
import { includes, uuid } from "../../../../../lib/scratch-uuid";

function getFileData(expr: any): string {
    return `file: ${expr.callee.loc.filename} line: ${expr.callee.loc.start.line} column: ${expr.callee.loc.start.column}`;
}

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

module.exports = {
    touching: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 1) errorMessages["Not enough arguments"](getFileData(fullExpr), "touching", args.length, 1)

        let firstArg = args[0];
        if (firstArg.type != "StringLiteral") {
            firstArg = "edge"
        } else if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value;
        }

        if (firstArg == "edge" || firstArg == "mouse") {
            firstArg = `_${firstArg}_`;
        }

        let mainKey = uuid(includes.alphanumeric_with_symbols, 5);
        let menuKey = uuid(includes.alphanumeric_with_symbols, 5);

        return {
            block: getBlockNumber(mainKey),

            additionalBlocks: {
                [mainKey]: block.createBlock({
                    opcode: BlockOpCode.SensingTouchingObject,
                    inputs: {
                        "TOUCHINGOBJECTMENU": getMenu(menuKey)
                    }
                }),

                [menuKey]: block.createBlock({
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
            }
        }
    }),

    touchingColor: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 1) errorMessages["Not enough arguments"](getFileData(fullExpr), "touchingColor", args.length, 1)

        let parsed = evaluate(args[0], parentID, OriginalSource);

        let mainKey = uuid(includes.alphanumeric_with_symbols, 5);

        return {
            block: getBlockNumber(mainKey),

            additionalBlocks: {
                [mainKey]: block.createBlock({
                    opcode: BlockOpCode.SensingTouchingColor,
                    inputs: {
                        "COLOR": parsed.block
                    }
                }),

                ...parsed.additionalBlocks
            }
        }
    }),

    colorIsTouchingColor: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 2) errorMessages["Not enough arguments"](getFileData(fullExpr), "colorIsTouchingColor", args.length, 2)

        let parsedColor1 = evaluate(args[0], parentID, OriginalSource);   
        let parsedColor2 = evaluate(args[1], parentID, OriginalSource);

        let mainKey = uuid(includes.alphanumeric_with_symbols, 5);

        return {
            block: getBlockNumber(mainKey),

            additionalBlocks: {
                [mainKey]: block.createBlock({
                    opcode: BlockOpCode.SensingTouchingColor,
                    inputs: {
                        "COLOR": parsedColor1.block,
                        "COLOR2": parsedColor2.block,
                    }
                }),

                ...parsedColor1.additionalBlocks,
                ...parsedColor2.additionalBlocks,
            }
        }
    }),

    distanceTo: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 1) errorMessages["Not enough arguments"](getFileData(fullExpr), "distanceTo", args.length, 1)

        let firstArg = args[0];
        if (firstArg.type != "StringLiteral") {
            firstArg = "mouse"
        } else if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value;
        }

        if (firstArg == "mouse") {
            firstArg = "_mouse_";
        }

        let mainKey = uuid(includes.alphanumeric_with_symbols, 5);
        let menuKey = uuid(includes.alphanumeric_with_symbols, 5);

        return {
            block: getBlockNumber(mainKey),

            additionalBlocks: {
                [mainKey]: block.createBlock({
                    opcode: BlockOpCode.SensingDistanceTo,
                    inputs: {
                        "DISTANCETOMENU": getMenu(menuKey)
                    }
                }),

                [menuKey]: block.createBlock({
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
            }
        }
    }),

    mouseDown: (() => {
        let mainKey = uuid(includes.alphanumeric_with_symbols, 5);

        return {
            block: getBlockNumber(mainKey),

            additionalBlocks: {
                [mainKey]: block.createBlock({
                    opcode: BlockOpCode.SensingMouseDown,
                }),
            }
        }
    }),

    keyDown: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 1) errorMessages["Not enough arguments"](getFileData(fullExpr), "keyDown", args.length, 1)

        let firstArg = args[0];
        if (firstArg.type != "StringLiteral" || firstArg.value && !KEYS.includes(firstArg.value)) {
            firstArg = "space"
        } else if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value;
        }

        let mainKey = uuid(includes.alphanumeric_with_symbols, 5);
        let menuKey = uuid(includes.alphanumeric_with_symbols, 5);

        return {
            block: getBlockNumber(mainKey),

            additionalBlocks: {
                [mainKey]: block.createBlock({
                    opcode: BlockOpCode.SensingKeyPressed,
                    inputs: {
                        "KEY_OPTION": getMenu(menuKey)
                    }
                }),

                [menuKey]: block.createBlock({
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
            }
        }
    }),

    itemOfObject: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 2) errorMessages["Not enough arguments"](getFileData(fullExpr), "itemOfObject", args.length, 2)

        let firstArg = args[0];
        let secondArg = args[1];
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

        let mainKey = uuid(includes.alphanumeric_with_symbols, 5);
        let menuKey = uuid(includes.alphanumeric_with_symbols, 5);

        return {
            block: getBlockNumber(mainKey),

            additionalBlocks: {
                [mainKey]: block.createBlock({
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

                [menuKey]: block.createBlock({
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
            }
        }
    }),

    current: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length < 1) errorMessages["Not enough arguments"](getFileData(fullExpr), "current", args.length, 1)

        let values = [
            "year",
            "month",
            "date",
            "day of week",
            "hour",
            "minute",
            "second"
        ]

        let firstArg = args[0];
        if (firstArg.type != "StringLiteral" || firstArg.value && !values.includes(firstArg.value)) {
            firstArg = "year";
        } else if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value;
        }

        let mainKey = uuid(includes.alphanumeric_with_symbols, 5);

        return {
            block: getBlockNumber(mainKey),

            additionalBlocks: {
                [mainKey]: block.createBlock({
                    opcode: BlockOpCode.SensingCurrent,
                    fields: {
                        "CURRENTMENU": [
                            firstArg.toUpperCase().replace(/\s/g,'')
                        ]
                    }
                })
            }
        }
    }),
}