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
 * Look blocks.
 */
;
import { evaluate } from "../../../util/evaluateValue";
import * as block from "../../../../../template/block";
import { BlockOpCode } from "../../../../../class/Sprite";
import { getBlockNumber, getMenu, getScratchType, ScratchType } from "../../../util/scratchType";
import * as uuid from "../../../../../lib/scratch-uuid";
import { errorMessages } from "../../../../../lib/console";

const graphicEffects = [
    "COLOR",
    "FISHEYE",
    "WHIRL",
    "PIXELATE",
    "MOSAIC",
    "BRIGHTNESS",
    "GHOST",
]

module.exports = {
    sayForSeconds: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 2) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "sayForSeconds", args.length, 2);
        let parsedMsg = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);
        let parsedSec = evaluate(args[1], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksSayForSecs,
                inputs: {
                    "MESSAGE": parsedMsg.block,
                    "SECS": parsedSec.block,
                }
            }),

            AdditionalBlocks: {
                ...parsedMsg.additionalBlocks,
                ...parsedSec.additionalBlocks,
            }
        }
    }),

    say: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "say", args.length, 1);
        let parsedMsg = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksSay,
                inputs: {
                    "MESSAGE": parsedMsg.block,
                }
            }),

            AdditionalBlocks: parsedMsg.additionalBlocks
        }
    }),

    thinkForSecs: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 2) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "thinkForSecs", args.length, 2);
        let parsedMsg = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);
        let parsedSec = evaluate(args[1], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksThinkForSecs,
                inputs: {
                    "MESSAGE": parsedMsg.block,
                    "SECS": parsedSec.block,
                }
            }),

            AdditionalBlocks: {
                ...parsedMsg.additionalBlocks,
                ...parsedSec.additionalBlocks,
            }
        }
    }),

    think: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "think", args.length, 1);
        let parsedMsg = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksThink,
                inputs: {
                    "MESSAGE": parsedMsg.block,
                }
            }),

            AdditionalBlocks: parsedMsg.additionalBlocks
        }
    }),

    switchCostumeTo: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "switchCostumeTo", args.length, 1);
        let firstArg = args[0];
        if (firstArg.type != "StringLiteral") {
            firstArg = ""
        } else if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value;
        }

        let costumeKey = uuid.uuid(uuid.includes.scratch_alphanumeric, 5);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksSwitchCostumeTo,
                inputs: {
                    "COSTUME": getMenu(costumeKey),
                }
            }),

            AdditionalBlocks: {
                [costumeKey]: block.createBlock({
                    opcode: BlockOpCode.LooksCostume,
                    parent: parentID,
                    fields: {
                        "COSTUME": [
                            firstArg,
                            null
                        ]
                    }
                })
            }
        }
    }),

    switchBackdropTo: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "switchCostumeTo", args.length, 1);
        let firstArg = args[0];
        if (firstArg.type != "StringLiteral") {
            firstArg = ""
        } else if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value;
        }

        let costumeKey = uuid.uuid(uuid.includes.scratch_alphanumeric, 5);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksSwitchBackdropTo,
                inputs: {
                    "BACKDROP": getMenu(costumeKey),
                }
            }),

            AdditionalBlocks: {
                [costumeKey]: block.createBlock({
                    opcode: BlockOpCode.LooksBackdrops,
                    parent: parentID,
                    fields: {
                        "BACKDROP": [
                            firstArg,
                            null
                        ]
                    }
                })
            }
        }
    }),

    nextCostume: (() => {
        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksNextCostume,
            }),
        }
    }),

    previousCostume: ((args: any, parentID: string) => {
        let subKey = uuid.uuid(uuid.includes.scratch_alphanumeric, 5);
        let costumeKey = uuid.uuid(uuid.includes.scratch_alphanumeric, 5);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksSwitchCostumeTo,
                inputs: {
                    "COSTUME": [
                        3,
                        subKey
                    ]
                }
            }),

            AdditionalBlocks: {
                [subKey]: block.createBlock({
                    opcode: BlockOpCode.OperatorSubtract,
                    parent: parentID,
                    inputs: {
                        "NUM1": getBlockNumber(costumeKey),
                        "NUM2": getScratchType(ScratchType.number, 1)
                    }
                }),

                [costumeKey]: block.createBlock({
                    opcode: BlockOpCode.LooksCostumeNumberName,
                    parent: subKey,
                    fields: {
                        "NUMBER_NAME": [
                            "number",
                            null
                        ]
                    }
                })
            }
        }
    }),

    nextBackdrop: (() => {
        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksNextBackdrop,
            }),
        }
    }),

    previousBackdrop: ((args: any, parentID: string) => {
        let subKey = uuid.uuid(uuid.includes.scratch_alphanumeric, 5);
        let costumeKey = uuid.uuid(uuid.includes.scratch_alphanumeric, 5);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksSwitchBackdropTo,
                inputs: {
                    "BACKDROP": [
                        3,
                        subKey
                    ]
                }
            }),

            AdditionalBlocks: {
                [subKey]: block.createBlock({
                    opcode: BlockOpCode.OperatorSubtract,
                    parent: parentID,
                    inputs: {
                        "NUM1": getBlockNumber(costumeKey),
                        "NUM2": getScratchType(ScratchType.number, 1)
                    }
                }),

                [costumeKey]: block.createBlock({
                    opcode: BlockOpCode.LooksBackdropNumberName,
                    parent: subKey,
                    fields: {
                        "NUMBER_NAME": [
                            "number",
                            null
                        ]
                    }
                })
            }
        }
    }),

    changeSizeBy: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "changeSizeBy", args.length, 1);
        let parsedMsg = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksChangeSizeBy,
                inputs: {
                    "CHANGE": parsedMsg.block,
                }
            }),

            AdditionalBlocks: parsedMsg.additionalBlocks
        }
    }),

    setSizeTo: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "setSizeTo", args.length, 1);
        let parsedMsg = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksSetSizeTo,
                inputs: {
                    "SIZE": parsedMsg.block,
                }
            }),

            AdditionalBlocks: parsedMsg.additionalBlocks
        }
    }),

    changeGraphicEffect: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 2) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "changeGraphicEffect", args.length, 2);
        let firstArg = args[0];

        if (firstArg.type != "StringLiteral" || firstArg.value && !graphicEffects.includes(firstArg.value.toUpperCase())) {
            firstArg = "COLOR"
        } else if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value;
        }

        let amount = evaluate(args[1], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksChangeEffectBy,
                inputs: {
                    "CHANGE": amount.block
                },

                fields: {
                    "EFFECT": [
                        firstArg,
                        null
                    ]
                }
            }),

            AdditionalBlocks: amount.additionalBlocks,
        }
    }),

    setGraphicEffect: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 2) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "setGraphicEffect", args.length, 2);
        let firstArg = args[0];

        if (firstArg.type != "StringLiteral" || firstArg.value && !graphicEffects.includes(firstArg.value.toUpperCase())) {
            firstArg = "COLOR"
        } else if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value;
        }

        let amount = evaluate(args[1], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksSetEffectTo,
                inputs: {
                    "VALUE": amount.block
                },

                fields: {
                    "EFFECT": [
                        firstArg,
                        null
                    ]
                }
            }),

            AdditionalBlocks: amount.additionalBlocks,
        }
    }),

    clearGraphicEffects: (() => {
        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksClearGraphicEffects,
            }),
        }
    }),

    setLayer: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "setLayer", args.length, 1);
        let firstArg = args[0];

        if (firstArg.type != "StringLiteral" || firstArg.value && firstArg.value != "font" && firstArg.value != "back") {
            firstArg = "front"
        } else if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value;
        }

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksGoToFrontBack,

                fields: {
                    "FRONT_BACK": [
                        firstArg,
                        null
                    ]
                }
            }),
        }
    }),

    changeLayer: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 2) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "changeLayer", args.length, 2);
        let firstArg = args[0];

        if (firstArg.type != "StringLiteral" || firstArg.value && firstArg.value != "forward" && firstArg.value != "backward") {
            firstArg = "forward"
        } else if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value;
        }

        let evaluated = evaluate(args[1], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksGoForwardBackwardLayers,

                inputs: {
                    "NUM": evaluated.block
                },

                fields: {
                    "FORWARD_BACKWARD": [
                        firstArg,
                        null
                    ]
                }
            }),

            additionalBlocks: evaluated.additionalBlocks
        }
    }),

    show: (() => {
        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksShow,
            }),
        }
    }),

    hide: (() => {
        return {
            Block: block.createBlock({
                opcode: BlockOpCode.LooksShow,
            }),
        }
    }),
}