/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : Identifier.ts
* Description       : Creates a reference to an identifier
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { BlockCluster, createBlock } from "../../util/blocks";
import { Identifier } from "@babel/types"
import { getBlockNumber, getVariable, getList } from "../../util/scratch-type"
import { BlockOpCode, buildData } from "../../util/types";
import { includes, uuid } from "../../util/scratch-uuid";

module.exports = ((BlockCluster: BlockCluster, Identifier: Identifier, _: any, buildData: buildData) => {
    let constTable: { [key: string]: BlockOpCode } = {
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
            let newKey = uuid(includes.scratch_alphanumeric, 16);

            BlockCluster.addBlocks({
                [newKey]: createBlock({
                    opcode: BlockOpCode.LooksCostumeNumberName,

                    fields: {
                        "NUMBER_NAME": [
                            "number",
                            null
                        ]
                    }
                })
            })

            return {
                block: getBlockNumber(newKey),
                blockId: null,
                isStaticBlock: true
            }
        }),

        "CostumeName": (() => {
            let newKey = uuid(includes.scratch_alphanumeric, 16);

            BlockCluster.addBlocks({
                [newKey]: createBlock({
                    opcode: BlockOpCode.LooksCostumeNumberName,

                    fields: {
                        "NUMBER_NAME": [
                            "name",
                            null
                        ]
                    }
                })
            })

            return {
                block: getBlockNumber(newKey),
                blockId: null,
                isStaticBlock: true
            }
        }),

        "BackdropIndex": (() => {
            let newKey = uuid(includes.scratch_alphanumeric, 16);

            BlockCluster.addBlocks({
                [newKey]: createBlock({
                    opcode: BlockOpCode.LooksBackdropNumberName,

                    fields: {
                        "NUMBER_NAME": [
                            "number",
                            null
                        ]
                    }
                })
            })

            return {
                block: getBlockNumber(newKey),
                blockId: null,
                isStaticBlock: true
            }
        }),

        "BackdropName": (() => {
            let newKey = uuid(includes.scratch_alphanumeric, 16);

            BlockCluster.addBlocks({
                [newKey]: createBlock({
                    opcode: BlockOpCode.LooksBackdropNumberName,

                    fields: {
                        "NUMBER_NAME": [
                            "name",
                            null
                        ]
                    }
                })
            })

            return {
                block: getBlockNumber(newKey),
                blockId: null,
                isStaticBlock: true
            }
        }),
    }

    if (constTable[Identifier.name]) {
        const id = uuid(includes.scratch_alphanumeric, 16);

        BlockCluster.addBlocks({
            [id]: createBlock({
                opcode: constTable[Identifier.name]
            })
        });

        return {
            block: getBlockNumber(id)
        };
    } else if (specialConst[Identifier.name]) {
        return specialConst[Identifier.name](Identifier);
    } else {
        let globals: any[] = buildData.packages.globals;
        let finalValue: any = undefined;

        globals.forEach((value) => {
            if (finalValue == undefined && value.name == Identifier.name)
            {
                finalValue = value.functions(BlockCluster);
            }
        })

        let isList = Identifier.name.startsWith("_list_");
        return finalValue != undefined && finalValue || {
            isStaticValue: true,
            blockId: null,
            block: !isList && getVariable(Identifier.name) || getList(Identifier.name.slice(6))
        }
    }
})