/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : ReturnStatement.ts
* Description       : Creates a return statement
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 09/11/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { AwaitExpression, CallExpression, Identifier, ReturnStatement, SourceLocation } from "@babel/types";
import { BlockCluster, createBlock } from "../util/blocks";
import { BlockOpCode, buildData } from "../util/types";
import { join } from "path";
import { Error } from "../util/err";
import { readFileSync } from "fs";
import { evaluate } from "../util/evaluate";
import { includes, uuid } from "../util/scratch-uuid";

function parseReturn(Block_Cluster: BlockCluster, ReturnStatement: ReturnStatement, buildData: buildData) {

    if (buildData.isFunction && ReturnStatement.argument) {
        let path = join(__dirname, '../assets/fn.json');
        let content = JSON.parse(readFileSync(path).toString());
        let fnData = content[buildData.functionName];
        let retCode = fnData.retCode;
        let arg = ReturnStatement.argument;

        let newId = uuid(includes.scratch_alphanumeric, 16);
        let finalId = uuid(includes.scratch_alphanumeric, 16);
        let evaluated = evaluate(arg.type, Block_Cluster, arg, newId, buildData);

        Block_Cluster.addBlocks({
            [finalId]: createBlock({
                opcode: BlockOpCode.DataSetVariableTo,
                inputs: {
                    "VALUE": evaluated.block
                },
                fields: {
                    "VARIABLE": [
                       retCode,
                       retCode,
                    ]
                }
            })
        });

        if (buildData.isFunction) {
            buildData.isFunction = false;
            buildData.functionName = null;
        }

        return {keysGenerated: [finalId]}
    }

    if (buildData.isFunction) {
        buildData.isFunction = false;
        buildData.functionName = null;
    }
    
    return {keysGenerated: []}
}

module.exports = parseReturn;