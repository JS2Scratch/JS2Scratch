/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : ExpressionStatement.ts
* Description       : Creates an expression statement
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { BlockCluster } from "../util/blocks";
import { ExpressionStatement } from "@babel/types"
import { buildData } from "../util/types";
module.exports = ((BlockCluster: BlockCluster, ExpressionStatement: ExpressionStatement, buildData: buildData) => {
    return require(`./${ExpressionStatement.expression.type}`)(BlockCluster, ExpressionStatement.expression, buildData);
})