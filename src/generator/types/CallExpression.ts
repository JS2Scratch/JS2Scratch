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

import { CallExpression, Identifier } from "@babel/types";
import { BlockCluster } from "../../util/blocks";
import { buildData } from "../../util/types";
import { existsSync, readFileSync } from "fs";
import { Warn } from "../../util/err";
import { join } from "path";
import { includes, uuid } from "../../util/scratch-uuid";
import { getScratchType, getVariable, ScratchType } from "../../util/scratch-type";

module.exports = ((BlockCluster: BlockCluster, CallExpression: CallExpression, p_: string, buildData: buildData) => {
    let callee = (CallExpression as any).callee;
    // Library name
    if (callee.object && callee.object.name) {
        let libName = callee.object.name;
        let fnName = callee.property.name;

        let fullPath = join(__dirname, "CallExpressionSub", libName + ".ts");
        let requiredLib: any;
        if (!existsSync(fullPath)) {
            // Check if this is a packaged library.
            let valueLibs: any[] = buildData.packages.libraries.valueLibraries;
            let finished = false;
            let endLoop = false;

            valueLibs.forEach((value) => {
                if (!endLoop && value.name == libName) {
                    finished = true;
                    endLoop = true;
                    requiredLib = value.functions;
                }
            });

            if (!finished) {
                Warn(`Unknown library, got: '${libName}'`);
                return { err: true };
            }
        } else {
            requiredLib = require(fullPath);
        }

        let requiredFn = requiredLib[fnName];

        if (!requiredFn) { Warn(`Unknown function of library ${libName}, got: '${fnName}'`); return { err: true }; }
        let ID = uuid(includes.scratch_alphanumeric, 16);

        return requiredFn(CallExpression, BlockCluster, ID, buildData);
    } 

    Warn("Cannot get the value of a function! Use `util.getReturnAddress` instead.");
    return { err: true };
})