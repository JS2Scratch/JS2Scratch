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
 * Sound blocks.
 */
;
import { evaluate } from "../../../util/evaluateValue";
import * as block from "../../../../../template/block";
import { BlockOpCode } from "../../../../../class/Sprite";
import { errorMessages } from "../../../../../lib/console";
import { includes, uuid } from "../../../../../lib/scratch-uuid";

const soundEffects = [
    "PITCH", "PAN"
]

module.exports = {
    playSoundUntilDone: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "playSoundUntilDone", args.length, 1);


        let menuKey = uuid(includes.scratch_alphanumeric, 5);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.SoundPlayUntilDone,
                inputs: {
                    "SOUND_MENU": [ 1, menuKey ]
                }
            }),
            
            AdditionalBlocks: {
                [menuKey]: block.createBlock({
                    opcode: BlockOpCode.SoundSoundsMenu,
                    fields: {
                        "SOUND_MENU": [
                            args[0].value,
                        ]
                    },
                    shadow: true
                })
            }
        }
    }),

    playSound: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "playSound", args.length, 1);

        let menuKey = uuid(includes.scratch_alphanumeric, 5);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.SoundPlay,
                inputs: {
                    "SOUND_MENU": [ 1, menuKey ]
                }
            }),
            
            AdditionalBlocks: {
                [menuKey]: block.createBlock({
                    opcode: BlockOpCode.SoundSoundsMenu,
                    fields: {
                        "SOUND_MENU": [
                            args[0].value,
                        ]
                    },
                    shadow: true
                })
            }
        }
    }),

    stopAllSounds: (() => {
        return {
            Block: block.createBlock({
                opcode: BlockOpCode.SoundStopAllSounds,
            }),
        }
    }),

    changeEffect: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 2) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "changeEffect", args.length, 2);
        let firstArg = args[0];

        if (firstArg.type != "StringLiteral" || firstArg.value && !soundEffects.includes(firstArg.value.toUpperCase())) {
            firstArg = "PITCH"
        } else if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value.toUpperCase();
        }

        let evaluated = evaluate(args[1], parentID, OriginalSource);
        
        return {
            Block: block.createBlock({
                opcode: BlockOpCode.SoundChangeEffectBy,
                inputs: {
                    "VALUE": evaluated.block
                },

                fields: {
                    "EFFECT": [
                        firstArg
                    ]
                }
            }),
            
            AdditionalBlocks: {
                ...evaluated.additionalBlocks,
            }
        }
    }),

    setEffect: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 2) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "setEffect", args.length, 2);
        let firstArg = args[0];

        if (firstArg.type != "StringLiteral" || firstArg.value && !soundEffects.includes(firstArg.value.toUpperCase())) {
            firstArg = "PITCH"
        } else if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value.toUpperCase();
        }

        let evaluated = evaluate(args[1], parentID, OriginalSource);
        
        return {
            Block: block.createBlock({
                opcode: BlockOpCode.SoundSetEffectTo,
                inputs: {
                    "VALUE": evaluated.block
                },

                fields: {
                    "EFFECT": [
                        firstArg
                    ]
                }
            }),
            
            AdditionalBlocks: {
                ...evaluated.additionalBlocks,
            }
        }
    }),

    changeVolume: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "changeVolume", args.length, 1);

        let evaluated = evaluate(args[0], parentID, OriginalSource);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.SoundChangeVolumeBy,
                inputs: {
                    "VOLUME": evaluated.block,
                }
            }),
            
            AdditionalBlocks: evaluated.additionalBlocks
        }
    }),

    setVolume: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "setVolume", args.length, 1);

        let evaluated = evaluate(args[0], parentID, OriginalSource);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.SoundSetVolumeTo,
                inputs: {
                    "VOLUME": evaluated.block,
                }
            }),
            
            AdditionalBlocks: evaluated.additionalBlocks
        }
    }),
}