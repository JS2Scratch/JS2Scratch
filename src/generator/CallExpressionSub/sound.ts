/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : sound.ts
* Description       : Sound library
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { CallExpression } from "@babel/types";
import { BlockOpCode, buildData, typeData } from "../../util/types";
import { BlockCluster, createBlock } from "../../util/blocks";
import { Error } from "../../util/err";
import { evaluate } from "../../util/evaluate";

const soundEffects = [
    "PITCH", "PAN"
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

        data.body(args, callExpression, blockCluster, parentID);
    })
}

module.exports = {
    playSoundUntilDone: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.SoundPlayUntilDone,
                    inputs: {
                        "SOUND_MENU": parsedArguments[0].block
                    }
                }),
            })
        })
    }),

    playSound: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.SoundPlay,
                    inputs: {
                        "SOUND_MENU": parsedArguments[0].block
                    }
                }),
            })
        })
    }),

    stopAllSounds: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.SoundStopAllSounds,
                })
            })
        })
    }),

    clearEffects: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.SoundClearEffects,
                })
            })
        })
    }),

    changeEffect: createFunction({
        minArgs: 2,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let firstArg: any = callExpression.arguments[0];

            if (firstArg.type != "StringLiteral" || firstArg.value && !soundEffects.includes(firstArg.value.toUpperCase())) {
                firstArg = "PITCH"
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value.toUpperCase();
            }

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.SoundChangeEffectBy,
                    inputs: {
                        "VALUE": parsedArguments[1].block
                    },

                    fields: {
                        "EFFECT": [
                            firstArg,
                            null
                        ]
                    }
                })
            })
        })
    }),

    setEffect: createFunction({
        minArgs: 2,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let firstArg: any = callExpression.arguments[0];

            if (firstArg.type != "StringLiteral" || firstArg.value && !soundEffects.includes(firstArg.value.toUpperCase())) {
                firstArg = "PITCH"
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value.toUpperCase();
            }

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.SoundSetEffectTo,
                    inputs: {
                        "VALUE": parsedArguments[1].block
                    },

                    fields: {
                        "EFFECT": [
                            firstArg,
                            null
                        ]
                    }
                })
            })
        })
    }),

    changeVolume: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.SoundChangeVolumeBy,
                    inputs: {
                        "VOLUME": parsedArguments[0].block
                    }
                }),
            })
        })
    }),

    setVolume: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.SoundSetVolumeTo,
                    inputs: {
                        "VOLUME": parsedArguments[0].block
                    }
                }),
            })
        })
    }),
}