/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : CallExpression.ts
* Description       : Creates an call expression (type)
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { CallExpression } from "@babel/types";
import { BlockCluster } from "../../util/blocks";
import { buildData } from "../../util/types";
import { existsSync } from "fs";
import { Warn } from "../../util/err";
import { join } from "path";
import { includes, uuid } from "../../util/scratch-uuid";

module.exports = ((BlockCluster: BlockCluster, CallExpression: CallExpression, buildData: buildData) => {
    let callee = (CallExpression as any).callee;
    // Library name
    if (callee.object && callee.object.name) {
        let libName = callee.object.name;
        let fnName = callee.property.name;
        
        let fullPath = join(__dirname, "CallExpressionSub", libName + ".ts");
        if (!existsSync(fullPath)) { Warn(`Unknown library, got: '${libName}'`); return { err: true }; }
        let requiredLib = require(fullPath);
        let requiredFn = requiredLib[fnName];

        if (!requiredFn) { Warn(`Unknown function of library ${libName}, got: '${fnName}'`); return { err: true }; }
        let ID = uuid(includes.scratch_alphanumeric, 16); 

        return requiredFn(CallExpression, BlockCluster, ID, buildData);
    }
})