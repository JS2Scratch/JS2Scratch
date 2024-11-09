/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : broadcast.ts
* Description       : Broadcasting library
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { CallExpression } from "@babel/types";
import { BlockOpCode, buildData, typeData } from "../../util/types";
import { BlockCluster, createBlock } from "../../util/blocks";
import { getBroadcast } from "../../util/scratch-type"
import { Error } from "../../util/err";
import { evaluate } from "../../util/evaluate";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

function createFunction(data: {
    minArgs: number,
    body: (parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData: buildData) => void
}) {
    return ((callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData: buildData) => {
        if (callExpression.arguments.length < data.minArgs) {
            new Error("Not enough arguments", buildData.originalSource, [{ line: callExpression.loc?.start.line || 1, column: callExpression.loc?.start.column || 1, length: (callExpression.loc?.end.column || 1) - (callExpression.loc?.start.column || 1) }], callExpression.loc?.filename || "")
        }

        let args: typeData[] = [];

        for (let i = 0; i < callExpression.arguments.length; i++) {
            args.push(
                evaluate(callExpression.arguments[i].type, blockCluster, callExpression.arguments[i], parentID, buildData)
            )
        }

        return data.body(args, callExpression, blockCluster, parentID, buildData);
    })
}

module.exports = {
    fire: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {

            let args = callExpression.arguments;
            let firstArg;
            if (args[0].type != "StringLiteral") {
                firstArg = "message1";
            } else {
                firstArg = args[0].value;
            }

            let broadcasts = join(__dirname, "../../assets/broadcasts.json");
            let broadcastArr = (JSON.parse(readFileSync(broadcasts).toString()) as string[]);
            
            if (!broadcastArr.includes(firstArg)) broadcastArr.push(firstArg);
            writeFileSync(broadcasts, JSON.stringify(broadcastArr));

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.EventBroadcast,
                    inputs: {
                        "BROADCAST_INPUT": getBroadcast(firstArg),
                    }
                }),
            })
        })
    }),

    fireYield: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {

            let args = callExpression.arguments;
            let firstArg;
            if (args[0].type != "StringLiteral") {
                firstArg = "message1";
            } else {
                firstArg = args[0].value;
            }

            let broadcasts = join(__dirname, "../../assets/broadcasts.json");
            let broadcastArr = (JSON.parse(readFileSync(broadcasts).toString()) as string[]);
            
            if (!broadcastArr.includes(firstArg)) broadcastArr.push(firstArg);
            writeFileSync(broadcasts, JSON.stringify(broadcastArr));

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.EventBroadcastAndWait,
                    inputs: {
                        "BROADCAST_INPUT": getBroadcast(firstArg),
                    }
                }),
            })
        })
    }),
}