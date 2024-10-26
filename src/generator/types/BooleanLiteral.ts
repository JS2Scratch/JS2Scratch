/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : BooleanLiteral.ts
* Description       : Creates a boolean
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { BlockCluster, createBlock } from "../../util/blocks";
import { BooleanLiteral } from "@babel/types"
import { getBlockNumber, getScratchType, ScratchType } from "../../util/scratch-type"
import { includes, uuid } from "../../util/scratch-uuid";
import { BlockOpCode } from "../../util/types";

module.exports = ((BlockCluster: BlockCluster, BooleanLiteral: BooleanLiteral, ParentIndex: string) => {
    let key = uuid(includes.scratch_alphanumeric, 16);
    BlockCluster.addBlocks({
        [key]: createBlock({
            opcode: BlockOpCode.OperatorEquals,
            parent: ParentIndex,

            inputs: {
                "OPERAND1": getScratchType(ScratchType.number, "1"),
                "OPERAND2": getScratchType(ScratchType.number, BooleanLiteral.value === true ? "1" : "0")
            }
        })
    })

    return {
        isStaticValue: true,
        blockId: key,
        block: getBlockNumber(key)
    }
})