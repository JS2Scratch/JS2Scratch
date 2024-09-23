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


import { existsSync } from "fs"
import { BlockCluster } from "./blocks"
import { buildData, typeData } from "./types"
import { error } from "../cli/berryProject"

export function evalutate(type: string, blockCluster: BlockCluster, instance: any, id: string, buildData: buildData): typeData
{
    let data: any;
    let s = false;
    let packageData = buildData.packages;
    for (let i = 0; i < packageData.type_implements.length; i++) {
        if (packageData.type_implements[i].name == type) {
            data = packageData.type_implements[i].body;
            s = true;
            break;
        }
    }

    let path = `../generator/types/${type}.ts`;
    if (!existsSync(path) && !s)
    {
        error("[internal] attempt to load non-existant type: " + type);
    } else if (!s)
    {
        data = require(path.substring(0, -3));
    }

    return data(blockCluster, instance, id, buildData)
}
