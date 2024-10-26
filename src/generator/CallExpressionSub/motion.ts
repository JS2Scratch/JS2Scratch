/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : motion.ts
* Description       : Motion library
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { CallExpression } from "@babel/types";
import { BlockOpCode, buildData, typeData } from "../../util/types";
import { Error } from "../../util/err";
import { evaluate } from "../../util/evaluate";
import { BlockCluster, createBlock } from "../../util/blocks";
import { includes, uuid } from "../../util/scratch-uuid"
import { getMenu } from "../../util/scratch-type"

function createFunction(data: {
    minArgs: number,
    body: (parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => void
}) {
    return ((callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData: buildData) => {
        if (callExpression.arguments.length < data.minArgs) {
            new Error("Not enough arguments", buildData.originalSource.substring(callExpression.loc?.start.index || 0, callExpression.loc?.end.index || 0), [{ line: callExpression.loc?.start.line || 1, column: callExpression.loc?.start.column || 1, length: (callExpression.loc?.end.column || 1) - (callExpression.loc?.start.column || 1) }], callExpression.loc?.filename || "")
        }

        let args: typeData[] = [];

        for (let i = 0; i < callExpression.arguments.length; i++) {
            args.push(
                evaluate(callExpression.arguments[i].type, blockCluster, callExpression.arguments[i], parentID, buildData)
            )
        }

        data.body(args, callExpression, blockCluster, parentID);
    })
}



module.exports = {
    move: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.MotionMoveSteps,
                    inputs: {
                        "STEPS": parsedArguments[0].block
                    }
                })
            })
        })
    }),

    turnRight: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.MotionTurnRight,
                    inputs: {
                        "DEGREES": parsedArguments[0].block
                    }
                })
            })
        })
    }),

    turnLeft: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.MotionTurnLeft,
                    inputs: {
                        "DEGREES": parsedArguments[0].block
                    }
                })
            })
        })
    }),

    gotoXY: createFunction({
        minArgs: 2,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.MotionGoToXY,
                    inputs: {
                        "X": parsedArguments[0].block,
                        "Y": parsedArguments[1].block,
                    }
                })
            })
        })
    }),

    goto: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let firstArg: any = callExpression.arguments[0];
            if (firstArg.type != "StringLiteral") {
                firstArg = "random" // The default
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value;
            }

            let menuKey = uuid(includes.alphanumeric_with_symbols, 16);

            if (firstArg == "random" || firstArg == "mouse") {
                firstArg = `_${firstArg}_`;
            }

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.MotionGoTo,
                    inputs: {
                        "TO": getMenu(menuKey)
                    }
                }),

                [menuKey]: createBlock({
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
            })
        })
    }),

    glide: createFunction({
        minArgs: 3,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.MotionGlideSecsToXY,
                    inputs: {
                        "SECS": parsedArguments[0].block,
                        "X": parsedArguments[1].block,
                        "Y": parsedArguments[2].block,
                    }
                })
            })
        })
    }),

    glideTo: createFunction({
        minArgs: 2,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let firstArg: any = callExpression.arguments[0];
            if (firstArg.type != "StringLiteral") {
                firstArg = "random" // The default
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value;
            }

            let menuKey = uuid(includes.alphanumeric_with_symbols, 16);

            if (firstArg == "random" || firstArg == "mouse") {
                firstArg = `_${firstArg}_`;
            }

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.MotionGlideTo,
                    inputs: {
                        "SECS": parsedArguments[0].block,
                        "TO": getMenu(menuKey),
                    }
                }),

                [menuKey]: createBlock({
                    opcode: BlockOpCode.MotionGlideToMenu,
                    parent: parentID,
                    fields: {
                        "TO": [
                            firstArg,
                            null
                        ]
                    },
                    shadow: true
                })
            })
        })
    }),

    point: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.MotionPointInDirection,
                    inputs: {
                        "DIRECTION": parsedArguments[0].block
                    }
                })
            })
        })
    }),

    pointTowards: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let firstArg: any = callExpression.arguments[0];
            if (firstArg.type != "StringLiteral") {
                firstArg = "random" // The default
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value;
            }

            let menuKey = uuid(includes.alphanumeric_with_symbols, 16);

            if (firstArg == "random" || firstArg == "mouse") {
                firstArg = `_${firstArg}_`;
            }

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.MotionPointTowards,
                    inputs: {
                        "TOWARDS": getMenu(menuKey),
                    }
                }),

                [menuKey]: createBlock({
                    opcode: BlockOpCode.MotionPointTowardsMenu,
                    parent: parentID,
                    fields: {
                        "TOWARDS": [ firstArg, null ]
                    },
                    shadow: true
                })
            })
        })
    }),

    changeX: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.MotionChangeXBy,
                    inputs: {
                        "DX": parsedArguments[0].block
                    }
                })
            })
        })
    }),

    changeY: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.MotionChangeYBy,
                    inputs: {
                        "DY": parsedArguments[0].block
                    }
                })
            })
        })
    }),

    setX: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.MotionSetX,
                    inputs: {
                        "X": parsedArguments[0].block
                    }
                })
            })
        })
    }),

    setY: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.MotionSetY,
                    inputs: {
                        "Y": parsedArguments[0].block
                    }
                })
            })
        })
    }),

    bounceOnEdge: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.MotionIfOnEdgeBounce,
                })
            })
        })
    }),

    setRotationStyle: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let menuKey = uuid(includes.alphanumeric_with_symbols, 16);

            let firstArg: any = callExpression.arguments[0];
            if (firstArg.type != "StringLiteral" || firstArg.value && firstArg.value != "left-right" && firstArg.value != "don't rotate" && firstArg.value != "all around") {
                (firstArg as string) = "left-right"
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value;
            }

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.MotionSetRotationStyle,
                    fields: {
                        "STYLE": [ firstArg ]
                    }
                }),
            })
        })
    }),
}