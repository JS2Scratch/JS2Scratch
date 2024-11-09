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
import { join } from "path";
import { Warn } from "../util/err";
import { existsSync } from "fs";
module.exports = ((BlockCluster: BlockCluster, ExpressionStatement: ExpressionStatement, buildData: buildData) => {
    let path = `./${ExpressionStatement.expression.type}`
    let finalPath = join(__dirname, path) + ".ts";

    if (!existsSync(finalPath)) {
        Warn(`No \`impl\` for '${ExpressionStatement.expression.type}'`);
        return { keysGenerated: [] }
    }

    return require(finalPath)(BlockCluster, ExpressionStatement.expression, buildData);
})