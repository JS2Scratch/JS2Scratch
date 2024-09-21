/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : StringLiteral.ts
* Description       : Creates a string
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { BlockCluster } from "../../util/blocks";
import { StringLiteral } from "@babel/types"
import { getScratchType, ScratchType } from "../../util/scratch-type"

module.exports = ((BlockCluster: BlockCluster, StringLiteral: StringLiteral) => {
    return {
        isStaticValue: true,
        blockId: null,
        block: getScratchType(ScratchType.string, StringLiteral.value)
    }
})