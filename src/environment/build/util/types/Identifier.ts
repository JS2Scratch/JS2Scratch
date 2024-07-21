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
 * Evaluates a variable.
 */

import { BlockOpCode } from '../../../../class/Sprite';
import { includes, uuid } from '../../../../lib/scratch-uuid';
import { createBlock } from '../../../../template/block';
import { getBlockNumber, getVariable, ScratchType } from '../scratchType'

module.exports = ((Identifier: {[key: string]: any}) => {

    let constTable: {[key: string]: BlockOpCode} = {
        X: BlockOpCode.MotionXPosition,
        Y: BlockOpCode.MotionYPosition,
        Direction: BlockOpCode.MotionDirection,

        Size: BlockOpCode.LooksSize,

        Volume: BlockOpCode.SoundVolume,
        Answer: BlockOpCode.SensingAnswer,
        MouseX: BlockOpCode.SensingMouseX,
        MouseY: BlockOpCode.SensingMouseY,
        Loudness: BlockOpCode.SensingLoudness,
        Timer: BlockOpCode.SensingTimer,
        DaysSince2000: BlockOpCode.SensingDaysSince2000,
        Username: BlockOpCode.SensingUsername,
        
    }

    let specialConst: any = {
        "CostumeIndex": (() => {
            let newKey = uuid(includes.scratch_alphanumeric, 5);
            return {
                block: getBlockNumber(newKey),
                additionalBlocks: {
                    [newKey]: createBlock({
                        opcode: BlockOpCode.LooksCostumeNumberName,
        
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

        "CostumeName": (() => {
            let newKey = uuid(includes.scratch_alphanumeric, 5);
            return {
                block: getBlockNumber(newKey),
                additionalBlocks: {
                    [newKey]: createBlock({
                        opcode: BlockOpCode.LooksCostumeNumberName,
        
                        fields: {
                            "NUMBER_NAME": [
                                "name",
                                null
                            ]
                        }
                    })
                }
            }
        }),

        "BackdropIndex": (() => {
            let newKey = uuid(includes.scratch_alphanumeric, 5);
            return {
                block: getBlockNumber(newKey),
                additionalBlocks: {
                    [newKey]: createBlock({
                        opcode: BlockOpCode.LooksBackdropNumberName,
        
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

        "BackdropName": (() => {
            let newKey = uuid(includes.scratch_alphanumeric, 5);
            return {
                block: getBlockNumber(newKey),
                additionalBlocks: {
                    [newKey]: createBlock({
                        opcode: BlockOpCode.LooksBackdropNumberName,
        
                        fields: {
                            "NUMBER_NAME": [
                                "name",
                                null
                            ]
                        }
                    })
                }
            }
        }),
    }

    if (constTable[Identifier.name]) {
        const motionBlockId = uuid(includes.scratch_alphanumeric);

        return {
            additionalBlocks: {
                [motionBlockId]: createBlock({
                    opcode: constTable[Identifier.name]
                })
            },
            
            block: getBlockNumber(motionBlockId)
        };
    } else if (specialConst[Identifier.name]) {
       return specialConst[Identifier.name](Identifier);
    } else {
        return {
            block: getVariable(ScratchType.variable, Identifier.name),
        };
    }

   
})