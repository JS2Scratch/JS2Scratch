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
 * Motion blocks.
 */
;
import { evaluate } from "../../../util/evaluateValue";
import * as block from "../../../../../template/block";
import { BlockOpCode } from "../../../../../class/Sprite";
import { getMenu, getScratchType, ScratchType } from "../../../util/scratchType";
import { errorMessages } from "../../../../../lib/console";
import { includes, uuid } from "../../../../../lib/scratch-uuid";

module.exports = {
    move: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "move", args.length, 1);
        let parsed = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.MotionMoveSteps,
                inputs: {
                    "STEPS": parsed.block
                }
            }),
            
            AdditionalBlocks: parsed.additionalBlocks
        }
    }),

    turnRight: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "turnRight", args.length, 1);
        let parsed = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.MotionTurnRight,
                inputs: {
                    "DEGREES": parsed.block
                }
            }),
            
            AdditionalBlocks: parsed.additionalBlocks
        }
    }),

    turnLeft: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "turnLeft", args.length, 1);
        let parsed = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.MotionTurnLeft,
                inputs: {
                    "DEGREES": parsed.block
                }
            }),
            
            AdditionalBlocks: parsed.additionalBlocks
        }
    }),

    gotoXY: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 2) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "gotoXY", args.length, 2);
        let parsedX = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);
        let parsedY = evaluate(args[1], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.MotionGoToXY,
                inputs: {
                    "X": parsedX.block,
                    "Y": parsedY.block,
                }
            }),
            
            AdditionalBlocks: {
                ...parsedX.additionalBlocks,
                ...parsedY.additionalBlocks,
            }
        }
    }),

    goto: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "goto", args.length, 1);
        let firstArg = args[0];
        if (firstArg.type != "StringLiteral" ) {
            firstArg = "random"
        } else if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value;
        }

        let menuKey = uuid(includes.alphanumeric_with_symbols, 5);

        if (firstArg == "random" || firstArg == "mouse") {
            firstArg = `_${firstArg}_`;
        }

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.MotionGoTo,
                inputs: {
                    "TO": getMenu(menuKey)
                }
            }),
            
            AdditionalBlocks: {
                [menuKey]: block.createBlock({
                    opcode: BlockOpCode.MotionGoToMenu,
                    parent: parentID,
                    fields: {
                        "TO": [
                            firstArg,
                            null
                        ]
                    },
                    shadow: true
                })
            }
        }
    }),

    glide: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 3) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "glide", args.length, 3);
        let parsedTime = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);
        let parsedX = evaluate(args[1], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);
        let parsedY = evaluate(args[2], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.MotionGlideSecsToXY,
                inputs: {
                    "SECS": parsedTime.block,
                    "X": parsedX.block,
                    "Y": parsedY.block,
                }
            }),
            
            AdditionalBlocks: {
                ...parsedX.additionalBlocks,
                ...parsedY.additionalBlocks,
                ...parsedTime.additionalBlocks,
            }
        }
    }),

    glideTo: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 2) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "glideTo", args.length, 2);
        let parsedTime = evaluate(args[1], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);
        
        let firstArg = args[0];
        if (firstArg.type != "StringLiteral" ) {
            firstArg = "random"
        } else if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value;
        }

        let glideID = uuid(includes.scratch_alphanumeric, 5);

        if (firstArg == "random" || firstArg == "mouse") {
            firstArg = `_${firstArg}_`;
        }

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.MotionGlideTo,
                inputs: {
                    "SECS": parsedTime.block,
                    "TO": getMenu(glideID),
                }
            }),
            
            AdditionalBlocks: {
               [glideID]: block.createBlock({
                opcode: BlockOpCode.MotionGlideToMenu,
                parent: parentID,
                fields: {
                    "TO": [
                        firstArg,
                        null
                    ]
                },
                shadow: true
               }),
                ...parsedTime.additionalBlocks,
            }
        }
    }),

    point: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "point", args.length, 1);
        let direction = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.MotionPointInDirection,
                inputs: {
                    "DIRECTION": direction.block,
                }
            }),
            
            AdditionalBlocks: direction.additionalBlocks,
        }
    }),

    pointTowards: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "pointTowards", args.length, 1);
        let firstArg = args[0];
        if (firstArg.type != "StringLiteral" ) {
            firstArg = "random"
        } else if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value;
        }

        if (firstArg == "random" || firstArg == "mouse") {
            firstArg = `_${firstArg}_`;
        }

        let menuKey = uuid(includes.alphanumeric_with_symbols, 5);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.MotionPointTowards,
                inputs: {
                    "TOWARDS": getMenu(menuKey)
                }
            }),
            
            AdditionalBlocks: {
                [menuKey]: block.createBlock({
                    opcode: BlockOpCode.MotionPointTowardsMenu,
                    parent: parentID,
                    fields: {
                        "TOWARDS": [
                            firstArg,
                            null
                        ]
                    },
                    shadow: true
                })
            }
        }
    }),

    changeX: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "changeX", args.length, 1);
        let parsedX = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.MotionChangeXBy,
                inputs: {
                    "DX": parsedX.block,
                }
            }),
            
            AdditionalBlocks: parsedX.additionalBlocks,
        }
    }),

    changeY: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "changeY", args.length, 1);
        let parsedY = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.MotionChangeYBy,
                inputs: {
                    "DY": parsedY.block,
                }
            }),
            
            AdditionalBlocks: parsedY.additionalBlocks,
        }
    }),

    setX: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "setX", args.length, 1);
        let parsedX = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.MotionSetX,
                inputs: {
                    "X": parsedX.block,
                }
            }),
            
            AdditionalBlocks: parsedX.additionalBlocks,
        }
    }),

    setY: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "setY", args.length, 1);
        let parsedY = evaluate(args[0], parentID, OriginalSource) || getScratchType(ScratchType.number, 0);

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.MotionSetY,
                inputs: {
                    "Y": parsedY.block,
                }
            }),
            
            AdditionalBlocks: parsedY.additionalBlocks,
        }
    }),

    bounceOnEdge: (() => {
        return {
            Block: block.createBlock({
                opcode: BlockOpCode.MotionIfOnEdgeBounce,
            }),
        }
    }),

    setRotationStyle: ((args: any, parentID: string, OriginalSource: string, fullExpr: any) => {
        if (args.length != 1) errorMessages["Not enough arguments"](`file: ${fullExpr.loc.filename} line: ${fullExpr.loc.start.line} column: ${fullExpr.loc.start.column}`, "setRotationStyle", args.length, 1);
        let firstArg = args[0];
        if (firstArg.type != "StringLiteral" || firstArg.value && firstArg.value != "left-right" && firstArg.value != "don't rotate" && firstArg.value != "all around") {
            firstArg = "left-right"
        } else if (firstArg.type == "StringLiteral") {
            firstArg = firstArg.value;
        }

        return {
            Block: block.createBlock({
                opcode: BlockOpCode.MotionSetRotationStyle,
                fields: {
                    "STYLE": [
                        firstArg
                    ]
                }
            })
        }
    }),
}