/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : CallExpression.ts
* Description       : Creates an call expression
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { CallExpression } from "@babel/types";
import { BlockCluster, createBlock, createMutation } from "../util/blocks";
import { BlockOpCode, buildData } from "../util/types";
import { existsSync } from "fs";
import { Warn } from "../util/err";
import { join } from "path";
import { includes, uuid } from "../util/scratch-uuid";
import { getScratchType, ScratchType } from "../util/scratch-type";
import { evaluate } from "../util/evaluate";

module.exports = ((BlockCluster: BlockCluster, CallExpression: CallExpression, buildData: buildData) => {
    let callee = (CallExpression as any).callee;
    // Library name
    if (callee.object && callee.object.name) {
        let libName = callee.object.name;
        let fnName = callee.property.name;
        
        let fullPath = join(__dirname, "CallExpressionSub", libName + ".ts");
        let requiredLib: any;
        if (!existsSync(fullPath)) {
            // Check if this is a packaged library.
            let valueLibs: any[] = buildData.packages.libraries.blockLibraries;
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
        let fn = requiredFn(CallExpression, BlockCluster, ID, buildData); 

        return {keysGenerated: [ID], terminate: fn && fn.terminate};
    } else if (callee.type == "Identifier" && callee.name)  
    {

        let ID = uuid(includes.scratch_alphanumeric, 16);
        let inputs: {[key: string]: any} = {};
        let fnName = (callee.name as string);
        let wasTurbo = fnName.startsWith("turbo_");
        if (wasTurbo)
        {
            fnName = fnName.substring(6);
        }

        let argumentids = "[";
        for (let i = 0; i < CallExpression.arguments.length; i++)
        {
            let code = fnName + "_" + i;
            let param = CallExpression.arguments[i];

            inputs[code] = evaluate(param.type, BlockCluster, param, ID, buildData).block;
            let hasNext = (i + 1) <= (CallExpression.arguments.length - 1)
            argumentids += `"${code}"${hasNext && "," || ""}`;
        };

        argumentids += "]";

        BlockCluster.addBlocks({
            [ID]: createMutation({
                opcode: BlockOpCode.ProceduresCall,
                inputs,
                mutation: {
                    tagName: "mutation",
                    children: [],
                    proccode: fnName + " " + "%s ".repeat(CallExpression.arguments.length).trimEnd(),
                    argumentids,
                    warp: wasTurbo && "true" || "false",
                }
            })
        });

        return { keysGenerated: [ID] };
    }
})