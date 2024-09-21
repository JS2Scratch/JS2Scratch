/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : UpdateExpression.ts
* Description       : Creates an Update expression
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { BlockCluster, createBlock } from "../util/blocks";
import { UpdateExpression } from "@babel/types"
import { BlockOpCode, buildData } from "../util/types";
import { uuid, includes } from "../util/scratch-uuid"
import { getScratchType, ScratchType } from "../util/scratch-type";

module.exports = ((BlockCluster: BlockCluster, UpdateExpression: UpdateExpression, buildData: buildData) => {

    let keysGenerated: string[] = [];
    let ID = uuid(includes.scratch_alphanumeric, 16);

    keysGenerated.push(ID);

    BlockCluster.addBlocks({
        [ID]: createBlock({
            opcode: BlockOpCode.DataChangeVariableBy,
            inputs: {
                "VALUE": getScratchType(ScratchType.number, UpdateExpression.operator == "++" && "1" || "-1")
            },
    
            fields: {
                "VARIABLE": [
                    (UpdateExpression as any).argument.name,
                    (UpdateExpression as any).argument.name,
                ]
            }
        })
    });

    return { keysGenerated }
})