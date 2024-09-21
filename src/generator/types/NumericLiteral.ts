/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : NumericLiteral.ts
* Description       : Creates a number
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { BlockCluster } from "../../util/blocks";
import { NumericLiteral } from "@babel/types"
import { getScratchType, ScratchType } from "../../util/scratch-type"

module.exports = ((BlockCluster: BlockCluster, NumericLiteral: NumericLiteral) => {
    return {
        isStaticValue: true,
        blockId: null,
        block: getScratchType(ScratchType.number, NumericLiteral.value)
    }
})