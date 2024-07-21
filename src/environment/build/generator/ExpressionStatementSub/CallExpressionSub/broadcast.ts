/**
 * ShadowX
 * 
 * Part of the "JS2Scratch" Project
 * 
 * [2024]
 * [ Made with love <3 ]
 *
 * @lisence MIT
 * 
 * @description
 * Broadcast blocks.
 */

import * as block from "../../../../../template/block";
import { BlockOpCode } from "../../../../../class/Sprite";
import { getBroadcast } from "../../../util/scratchType";
import { errorMessages } from "../../../../../lib/console";

module.exports = {
    fire: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "fire", args.length, 2);

        let firstArg;
        if (args[0].type != "StringLiteral") {
            firstArg = "message1";
        } else {
            firstArg = args[0].value;
        }

        
        return {
            Block: block.createBlock({
                opcode: BlockOpCode.EventBroadcast,
                inputs: {
                    "BROADCAST_INPUT": getBroadcast(firstArg),
                }
            }),
        }
    }),

    fireYield: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "fire", args.length, 2);

        let firstArg;
        if (args[0].type != "StringLiteral") {
            firstArg = "message1";
        } else {
            firstArg = args[0].value;
        }

        
        return {
            Block: block.createBlock({
                opcode: BlockOpCode.EventBroadcastAndWait,
                inputs: {
                    "BROADCAST_INPUT": getBroadcast(firstArg),
                }
            }),
        }
    }),
}