/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : looks.ts
* Description       : Looks library
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
import { includes, uuid } from "../../util/scratch-uuid"
import { getBlockNumber, getMenu, getScratchType, ScratchType } from "../../util/scratch-type"
import { Error } from "../../util/err";
import { evalutate } from "../../util/evaluate";

const graphicEffects = [
    "COLOR",
    "FISHEYE",
    "WHIRL",
    "PIXELATE",
    "MOSAIC",
    "BRIGHTNESS",
    "GHOST",
]

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
                evalutate(callExpression.arguments[i].type, blockCluster, callExpression.arguments[i], parentID, buildData)
            )
        }

        data.body(args, callExpression, blockCluster, parentID);
    })
}

module.exports = {
    sayForSeconds: createFunction({
        minArgs: 2,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksSayForSecs,
                    inputs: {
                        "MESSAGE": parsedArguments[0].block,
                        "SECS": parsedArguments[1].block,
                    }
                })
            })
        })
    }),

    say: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksSay,
                    inputs: {
                        "MESSAGE": parsedArguments[0].block,
                    }
                })
            })
        })
    }),

    thinkForSecs: createFunction({
        minArgs: 2,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksThinkForSecs,
                    inputs: {
                        "MESSAGE": parsedArguments[0].block,
                        "SECS": parsedArguments[1].block,
                    }
                })
            })
        })
    }),

    think: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksThink,
                    inputs: {
                        "MESSAGE": parsedArguments[0].block,
                    }
                })
            })
        })
    }),

    switchCostumeTo: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {

            let menuKey = uuid(includes.scratch_alphanumeric, 16);
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksSwitchCostumeTo,
                    inputs: {
                        "COSTUME": getMenu(menuKey),
                    }
                }),

                [menuKey]: createBlock({
                    opcode: BlockOpCode.LooksCostume,
                    parent: parentID,
                    fields: {
                        "COSTUME": [
                            callExpression.arguments[0].type == "StringLiteral" && callExpression.arguments[0].value || "",
                            null
                        ]
                    }
                })
            })
        })
    }),


    switchBackdropTo: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {

            let menuKey = uuid(includes.scratch_alphanumeric, 16);
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksSwitchBackdropTo,
                    inputs: {
                        "BACKDROP": getMenu(menuKey),
                    }
                }),

                [menuKey]: createBlock({
                    opcode: BlockOpCode.LooksBackdrops,
                    parent: parentID,
                    fields: {
                        "BACKDROP": [
                            callExpression.arguments[0].type == "StringLiteral" && callExpression.arguments[0].value || "",
                            null
                        ]
                    }
                })
            })
        })
    }),

    nextCostume: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksNextCostume,
                })
            })
        })
    }),

    previousCostume: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let subKey = uuid(includes.scratch_alphanumeric, 16);
            let costumeKey = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksSwitchCostumeTo,
                    inputs: {
                        "COSTUME": [
                            3,
                            subKey
                        ]
                    },
                }),

                [subKey]: createBlock({
                    opcode: BlockOpCode.OperatorSubtract,
                    parent: parentID,
                    inputs: {
                        "NUM1": getBlockNumber(costumeKey),
                        "NUM2": getScratchType(ScratchType.number, 1)
                    }
                }),

                [costumeKey]: createBlock({
                    opcode: BlockOpCode.LooksCostumeNumberName,
                    parent: subKey,
                    fields: {
                        "NUMBER_NAME": [
                            "number",
                            null
                        ]
                    }
                })
            })
        })
    }),

    nextBackdrop: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksNextBackdrop,
                })
            })
        })
    }),

    previousBackdrop: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let subKey = uuid(includes.scratch_alphanumeric, 16);
            let costumeKey = uuid(includes.scratch_alphanumeric, 16);

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksSwitchBackdropTo,
                    inputs: {
                        "BACKDROP": [
                            3,
                            subKey
                        ]
                    },
                }),

                [subKey]: createBlock({
                    opcode: BlockOpCode.OperatorSubtract,
                    parent: parentID,
                    inputs: {
                        "NUM1": getBlockNumber(costumeKey),
                        "NUM2": getScratchType(ScratchType.number, 1)
                    }
                }),

                [costumeKey]: createBlock({
                    opcode: BlockOpCode.LooksBackdropNumberName,
                    parent: subKey,
                    fields: {
                        "NUMBER_NAME": [
                            "number",
                            null
                        ]
                    }
                })
            })
        })
    }),

    changeSizeBy: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksChangeSizeBy,
                    inputs: {
                        "CHANGE": parsedArguments[0].block,
                    }
                })
            })
        })
    }),

    setSizeTo: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksSetSizeTo,
                    inputs: {
                        "SIZE": parsedArguments[0].block,
                    }
                })
            })
        })
    }),

    changeGraphicEffect: createFunction({
        minArgs: 2,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let firstArg: any = callExpression.arguments[0];

            if (firstArg.type != "StringLiteral" || firstArg.value && !graphicEffects.includes(firstArg.value.toUpperCase())) {
                firstArg = "COLOR"
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value;
            }

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksChangeEffectBy,
                    inputs: {
                        "CHANGE": parsedArguments[1].block
                    },

                    fields: {
                        "EFFECT": [
                            firstArg,
                            null
                        ]
                    }
                })
            })
        })
    }),

    setGraphicEffect: createFunction({
        minArgs: 2,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let firstArg: any = callExpression.arguments[0];

            if (firstArg.type != "StringLiteral" || firstArg.value && !graphicEffects.includes(firstArg.value.toUpperCase())) {
                firstArg = "COLOR"
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value;
            }

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksSetEffectTo,
                    inputs: {
                        "VALUE": parsedArguments[1].block
                    },

                    fields: {
                        "EFFECT": [
                            firstArg,
                            null
                        ]
                    }
                })
            })
        })
    }),

    clearGraphicEffects: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksClearGraphicEffects,
                })
            })
        })
    }),

    setLayer: createFunction({
        minArgs: 1,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let firstArg: any = callExpression.arguments[0];

            if (firstArg.type != "StringLiteral" || firstArg.value && firstArg.value != "font" && firstArg.value != "back") {
                firstArg = "front"
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value;
            }

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksGoToFrontBack,
                    fields: {
                        "FRONT_BACK": [
                            firstArg,
                            null
                        ]
                    }
                })
            })
        })
    }),

    changeLayer: createFunction({
        minArgs: 2,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            let firstArg: any = callExpression.arguments[0];

            if (firstArg.type != "StringLiteral" || firstArg.value && firstArg.value != "font" && firstArg.value != "back") {
                firstArg = "front"
            } else if (firstArg.type == "StringLiteral") {
                firstArg = firstArg.value;
            }

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksGoForwardBackwardLayers,
                    inputs: {
                        "NUM": parsedArguments[1].block
                    },
    
                    fields: {
                        "FORWARD_BACKWARD": [
                            firstArg,
                            null
                        ]
                    }
                })
            })
        })
    }),

    show: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksShow,
                })
            })
        })
    }),

    hide: createFunction({
        minArgs: 0,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string) => {
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.LooksHide,
                })
            })
        })
    }),
}