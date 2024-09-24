/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : index.ts
* Description       : Init for `rand` package
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 24/09/2024	saaawdust	Created file, setup environment
*
/******************************************************************/

import { BlockOpCode, createBlock, createLibrary, createValueFunction, typeData } from "../utils/library";
import { getBlockNumber, getScratchType, ScratchType } from "../utils/internal";

function rand_uuid() {
    let result = '';
    let str = "0123456789abcdef";

    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * str.length);
        result += str.charAt(randomIndex);
    }

    return result;
}

module.exports = {
    libraries: {
        valueLibraries: [
            createLibrary("rand", {
                ["new"]: createValueFunction({
                    maximumArguments: 1,
                    parseArguments: true,
                    body(callExpression, blockCluster, parentId, buildData, parsedArguments) {
                        let IDs = [
                            rand_uuid(), // div
                            rand_uuid(), // mod
                            rand_uuid(), // * n.1
                        ];

                        let val;
                        let extra = {};
                        if (parsedArguments && parsedArguments[0]) {
                            val = parsedArguments[0].block;
                            extra = {};
                        } else {
                            let n2 = rand_uuid();
                            let ds2 = rand_uuid();
                            let rnd = rand_uuid();

                            val = getBlockNumber(n2);
                            extra = {
                                // Left Mod - Multiply n.2
                                [n2]: createBlock({
                                    opcode: BlockOpCode.OperatorMultiply,
                                    parent: IDs[2],
                                    inputs: {
                                        "NUM1": getBlockNumber(ds2),
                                        "NUM2": getBlockNumber(rnd),
                                    }
                                }),

                                // DS2
                                [ds2]: createBlock({
                                    opcode: BlockOpCode.SensingDaysSince2000,
                                    parent: IDs[3],
                                }),

                                // rnd
                                [rnd]: createBlock({
                                    opcode: BlockOpCode.OperatorRandom,
                                    parent: IDs[3],
                                    inputs: {
                                        "FROM": getScratchType(ScratchType.number, -10000),
                                        "TO": getScratchType(ScratchType.number, 10000),
                                    }
                                }),
                            };
                        }

                        blockCluster.addBlocks({
                            // Main divide
                            [IDs[0]]: createBlock({
                                opcode: BlockOpCode.OperatorDivide,
                                inputs: {
                                    "NUM1": getBlockNumber(IDs[1]),
                                    "NUM2": getScratchType(ScratchType.number, 2147483647)
                                }
                            }),

                            // Left Mod
                            [IDs[1]]: createBlock({
                                opcode: BlockOpCode.OperatorMod,
                                parent: IDs[0],
                                inputs: {
                                    "NUM1": getBlockNumber(IDs[2]),
                                    "NUM2": getScratchType(ScratchType.number, 2147483647)
                                }
                            }),

                            // Left Mod - Multiply n.1
                            [IDs[2]]: createBlock({
                                opcode: BlockOpCode.OperatorMultiply,
                                parent: IDs[1],
                                inputs: {
                                    "NUM1": val,
                                    "NUM2": getScratchType(ScratchType.number, 16807)
                                }
                            }),



                            ...extra
                        });

                        return {
                            block: getBlockNumber(IDs[0]),
                            blockId: null,
                            isStaticValue: true,
                        }
                    },
                }),

                ["float"]: createValueFunction({
                    minimumArguments: 2,
                    maximumArguments: 3,
                    parseArguments: true,
                    body(callExpression, blockCluster, parentId, buildData, parsedArguments) {
                        let IDs = [
                            rand_uuid(), // div
                            rand_uuid(), // mod
                            rand_uuid(), // * n.1

                            rand_uuid(), // * n.3
                            rand_uuid(), // * n.4
                            rand_uuid(), // +
                        ];

                        parsedArguments = (parsedArguments as typeData[]);

                        let val;
                        let extra = {};
                        if (parsedArguments && parsedArguments[2]) {
                            val = parsedArguments[2].block;
                            extra = {};
                        } else {
                            let n2 = rand_uuid();
                            let ds2 = rand_uuid();
                            let rnd = rand_uuid();

                            val = getBlockNumber(n2);
                            extra = {
                                // Left Mod - Multiply n.2
                                [n2]: createBlock({
                                    opcode: BlockOpCode.OperatorMultiply,
                                    parent: IDs[2],
                                    inputs: {
                                        "NUM1": getBlockNumber(ds2),
                                        "NUM2": getBlockNumber(rnd),
                                    }
                                }),

                                // DS2
                                [ds2]: createBlock({
                                    opcode: BlockOpCode.SensingDaysSince2000,
                                    parent: IDs[3],
                                }),

                                // rnd
                                [rnd]: createBlock({
                                    opcode: BlockOpCode.OperatorRandom,
                                    parent: IDs[3],
                                    inputs: {
                                        "FROM": getScratchType(ScratchType.number, -10000),
                                        "TO": getScratchType(ScratchType.number, 10000),
                                    }
                                }),
                            };
                        }

                        blockCluster.addBlocks({
                            // Scale * n.3
                            [IDs[3]]: createBlock({
                                opcode: BlockOpCode.OperatorMultiply,
                                parent: IDs[5],
                                inputs: {
                                    "NUM1": getBlockNumber(IDs[0]),
                                    "NUM2": getBlockNumber(IDs[4])
                                }
                            }),

                            // Scale -
                            [IDs[4]]: createBlock({
                                opcode: BlockOpCode.OperatorSubtract,
                                parent: IDs[3],
                                inputs: {
                                    "NUM1": parsedArguments[1].block, // max
                                    "NUM2": parsedArguments[0].block // min
                                }
                            }),

                            // Scale +
                            [IDs[5]]: createBlock({
                                opcode: BlockOpCode.OperatorAdd,
                                inputs: {
                                    "NUM1": parsedArguments[0].block, // min
                                    "NUM2": getBlockNumber(IDs[3])
                                }
                            }),

                            // Main divide
                            [IDs[0]]: createBlock({
                                opcode: BlockOpCode.OperatorDivide,
                                parent: IDs[3],
                                inputs: {
                                    "NUM1": getBlockNumber(IDs[1]),
                                    "NUM2": getScratchType(ScratchType.number, 2147483647)
                                }
                            }),

                            // Left Mod
                            [IDs[1]]: createBlock({
                                opcode: BlockOpCode.OperatorMod,
                                parent: IDs[0],
                                inputs: {
                                    "NUM1": getBlockNumber(IDs[2]),
                                    "NUM2": getScratchType(ScratchType.number, 2147483647)
                                }
                            }),

                            // Left Mod - Multiply n.1
                            [IDs[2]]: createBlock({
                                opcode: BlockOpCode.OperatorMultiply,
                                parent: IDs[1],
                                inputs: {
                                    "NUM1": val,
                                    "NUM2": getScratchType(ScratchType.number, 16807)
                                }
                            }),



                            ...extra
                        });

                        return {
                            block: getBlockNumber(IDs[5]),
                            blockId: null,
                            isStaticValue: true,
                        }
                    },
                }),

                ["int"]: createValueFunction({
                    minimumArguments: 2,
                    maximumArguments: 3,
                    parseArguments: true,
                    body(callExpression, blockCluster, parentId, buildData, parsedArguments) {
                        let IDs = [
                            rand_uuid(), // div
                            rand_uuid(), // mod
                            rand_uuid(), // * n.1

                            rand_uuid(), // * n.3
                            rand_uuid(), // * n.4
                            rand_uuid(), // +

                            rand_uuid(), // floor
                        ];

                        parsedArguments = (parsedArguments as typeData[]);

                        let val;
                        let extra = {};
                        if (parsedArguments && parsedArguments[2]) {
                            val = parsedArguments[2].block;
                            extra = {};
                        } else {
                            let n2 = rand_uuid();
                            let ds2 = rand_uuid();
                            let rnd = rand_uuid();

                            val = getBlockNumber(n2);
                            extra = {
                                // Left Mod - Multiply n.2
                                [n2]: createBlock({
                                    opcode: BlockOpCode.OperatorMultiply,
                                    parent: IDs[2],
                                    inputs: {
                                        "NUM1": getBlockNumber(ds2),
                                        "NUM2": getBlockNumber(rnd),
                                    }
                                }),

                                // DS2
                                [ds2]: createBlock({
                                    opcode: BlockOpCode.SensingDaysSince2000,
                                    parent: IDs[3],
                                }),

                                // rnd
                                [rnd]: createBlock({
                                    opcode: BlockOpCode.OperatorRandom,
                                    parent: IDs[3],
                                    inputs: {
                                        "FROM": getScratchType(ScratchType.number, -10000),
                                        "TO": getScratchType(ScratchType.number, 10000),
                                    }
                                }),
                            };
                        }

                        blockCluster.addBlocks({
                            // Scale * n.3
                            [IDs[3]]: createBlock({
                                opcode: BlockOpCode.OperatorMultiply,
                                parent: IDs[5],
                                inputs: {
                                    "NUM1": getBlockNumber(IDs[0]),
                                    "NUM2": getBlockNumber(IDs[4])
                                }
                            }),

                            // Scale -
                            [IDs[4]]: createBlock({
                                opcode: BlockOpCode.OperatorSubtract,
                                parent: IDs[3],
                                inputs: {
                                    "NUM1": parsedArguments[1].block, // max
                                    "NUM2": parsedArguments[0].block // min
                                }
                            }),

                            // Scale +
                            [IDs[5]]: createBlock({
                                opcode: BlockOpCode.OperatorAdd,
                                inputs: {
                                    "NUM1": parsedArguments[0].block, // min
                                    "NUM2": getBlockNumber(IDs[3])
                                }
                            }),

                            // Scale +
                            [IDs[6]]: createBlock({
                                opcode: BlockOpCode.OperatorMathOp,
                                inputs: {
                                    "NUM": getBlockNumber(IDs[5])
                                },

                                fields: {
                                    "OPERATOR": [
                                        "floor"
                                    ]
                                }
                            }),

                            // Main divide
                            [IDs[0]]: createBlock({
                                opcode: BlockOpCode.OperatorDivide,
                                parent: IDs[3],
                                inputs: {
                                    "NUM1": getBlockNumber(IDs[1]),
                                    "NUM2": getScratchType(ScratchType.number, 2147483647)
                                }
                            }),

                            // Left Mod
                            [IDs[1]]: createBlock({
                                opcode: BlockOpCode.OperatorMod,
                                parent: IDs[0],
                                inputs: {
                                    "NUM1": getBlockNumber(IDs[2]),
                                    "NUM2": getScratchType(ScratchType.number, 2147483647)
                                }
                            }),

                            // Left Mod - Multiply n.1
                            [IDs[2]]: createBlock({
                                opcode: BlockOpCode.OperatorMultiply,
                                parent: IDs[1],
                                inputs: {
                                    "NUM1": val,
                                    "NUM2": getScratchType(ScratchType.number, 16807)
                                }
                            }),



                            ...extra
                        });

                        return {
                            block: getBlockNumber(IDs[6]),
                            blockId: null,
                            isStaticValue: true,
                        }
                    },
                })
            })
        ]
    }
};