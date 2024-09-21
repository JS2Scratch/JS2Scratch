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

import { BlockCluster } from "../../util/blocks";
import { Identifier } from "@babel/types"
import { getVariable } from "../../util/scratch-type"

module.exports = ((BlockCluster: BlockCluster, Identifier: Identifier) => {
    return {
        isStaticValue: true,
        blockId: null,
        block: getVariable(Identifier.name)
    }
})