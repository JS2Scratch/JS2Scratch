/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : evalutate.ts
* Description       : Evaluates a type
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/


import { BlockCluster } from "./blocks"
import { buildData, typeData } from "./types"

export function evalutate(type: string, blockCluster: BlockCluster, instance: any, id: string, buildData: buildData): typeData
{
    return require(`../generator/types/${type}`)(blockCluster, instance, id, buildData)
}
