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
 * Array blocks.
 */
;
import { evaluate } from "../../../util/evaluateValue";
import * as block from "../../../../../template/block";
import { BlockOpCode } from "../../../../../class/Sprite";
import { errorMessages } from "../../../../../lib/console";

module.exports = {
    ask: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "ask", args.length, 1);

        let evaluated = evaluate(args[0], parentID, OriginalSource);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.SensingAskAndWait,
                inputs: {
                    "QUESTION": evaluated.block
                }
            }),

            AdditionalBlocks: evaluated.additionalBlocks
        }
    }),

    resetTimer: (() => {
        return {
            Block: block.createBlock({
                opcode: BlockOpCode.SensingResetTimer,
            }),
        }
    }),

    setDragMode: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "ask", args.length, 1);

        let firstArg = args[0];
        if (firstArg.type != "StringLiteral" || firstArg.value && firstArg.value != "draggable" && firstArg.value != "not draggable") {
            firstArg = "draggable";
        } else {
            firstArg = firstArg.value;
        }

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.SensingSetDragMode,
                fields: {
                    "DRAG_MODE": [
                        firstArg
                    ]
                }
            }),
        }
    }),
}