/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : list.ts
* Description       : List library
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { ArrayExpression, BooleanLiteral, CallExpression, StringLiteral } from "@babel/types";
import { BlockOpCode, buildData, typeData } from "../../util/types";
import { BlockCluster, createBlock } from "../../util/blocks";
import { Error } from "../../util/err";
import { evaluate } from "../../util/evaluate";
import { includes, uuid } from "../../util/scratch-uuid";
import { getBlockNumber, getScratchType, ScratchType } from "../../util/scratch-type";
import { join } from "path";
import { readFileSync, writeFileSync } from "fs";

function createFunction(data: {
    minArgs: number,
    argTypes?: string[]
    doParse: boolean,
    body: (parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData: buildData) => void
}) {
    return ((callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData: buildData) => {
        if (callExpression.arguments.length < data.minArgs) {
            new Error("Not enough arguments", buildData.originalSource, [{ line: callExpression.loc?.start.line || 1, column: callExpression.loc?.start.column || 1, length: (callExpression.loc?.end.column || 1) - (callExpression.loc?.start.column || 1) }], callExpression.loc?.filename || "")
        }

        let args: typeData[] = [];

        for (let i = 0; i < callExpression.arguments.length; i++) {
            let type = callExpression.arguments[i].type;
            if ((data.argTypes && data.argTypes[i] && data.argTypes[i] == type) || !data.argTypes || data.argTypes && !data.argTypes[i]) {
                if (!data.doParse) continue;

                args.push(
                    evaluate(type, blockCluster, callExpression.arguments[i], parentID, buildData)
                )
            } else if (data.argTypes && data.argTypes[i] && data.argTypes[i] != type) {
                new Error(`Expected '${data.argTypes[i]}' for argument '${i + 1}', got: '${type}'`, buildData.originalSource, [{ line: callExpression.loc?.start.line || 1, column: callExpression.loc?.start.column || 1, length: (callExpression.loc?.end.column || 1) - (callExpression.loc?.start.column || 1) }], callExpression.loc?.filename || "")
            }
        }

        data.body(args, callExpression, blockCluster, parentID, buildData);
    })
}

module.exports = {
    newList: createFunction({
        minArgs: 3,
        argTypes: ["StringLiteral", "ArrayExpression", "BooleanLiteral"],
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData: buildData) => {
            let listName = (callExpression.arguments[0] as StringLiteral);
            let inputArr: ArrayExpression = (callExpression.arguments[1] as ArrayExpression);
            let firstID = uuid(includes.scratch_alphanumeric, 16);
            let blocks: any = {
                [firstID]: createBlock({
                    opcode: BlockOpCode.DataDeleteAllOfList,
                    parent: parentID,
                    fields: {
                        "LIST": [
                            listName.value,
                            listName.value,
                        ]
                    }
                })
            };

            let previousID = firstID;
            for (let i = 0; i < inputArr.elements.length; i++) {
                let newID = uuid(includes.scratch_alphanumeric, 16);
                let arrayObject = (inputArr.elements[i] as any);

                let evaluation = evaluate(arrayObject.type, blockCluster, arrayObject, newID, buildData);

                blocks[previousID].next = newID;

                blocks = {
                    ...blocks,
                    [newID]: createBlock({
                        opcode: BlockOpCode.DataAddToList,
                        parent: previousID,
                        inputs: {
                            "ITEM": evaluation.block
                        },

                        fields: {
                            "LIST": [
                                listName.value,
                                listName.value,
                            ]
                        }
                    })
                }

                previousID = newID;
            }

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.ControlRepeat,
                    inputs: {
                        "TIMES": getScratchType(ScratchType.number, 1),
                        "SUBSTACK": firstID == null ? undefined : [2, firstID]
                    }
                }),

                ...blocks
            })

            if ((callExpression.arguments[2] as BooleanLiteral).value) {
                let jsonFile = join(__dirname, "../../assets/lists.json");
                let content = JSON.parse(readFileSync(jsonFile).toString()) as any[];
                content.push(listName.value);
    
                writeFileSync(jsonFile, JSON.stringify(content));
            }
        })
    }),

    push: createFunction({
        minArgs: 2,
        argTypes: ["StringLiteral"],
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let args = callExpression.arguments;
            let id = uuid(includes.scratch_alphanumeric, 16);
            let evaluated = evaluate(args[1].type, blockCluster, args[1], id, buildData);
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.DataAddToList,
                    inputs: {
                        "ITEM": evaluated.block,
                    },

                    fields: {
                        "LIST": [
                            (args[0] as StringLiteral).value,
                            (args[0] as StringLiteral).value,
                        ]
                    }
                })
            })
        })
    }),

    pop: createFunction({
        minArgs: 1,
        argTypes: ["StringLiteral"],
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let listName = (callExpression.arguments[0] as StringLiteral).value
            let lengthID = uuid(includes.scratch_alphanumeric, 5);
            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.DataDeleteOfList,
                    inputs: {
                        "INDEX": getBlockNumber(lengthID)
                    },

                    fields: {
                        "LIST": [
                            listName,
                            listName,
                        ]
                    }
                }),

                [lengthID]: createBlock({
                    opcode: BlockOpCode.DataLengthOfList,
                    parent: parentID,
                    fields: {
                        "LIST": [
                            listName,
                            listName,
                        ]
                    }
                })
            })
        })
    }),

    shift: createFunction({
        minArgs: 1,
        argTypes: ["StringLiteral"],
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let listName = (callExpression.arguments[0] as StringLiteral).value

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.DataDeleteOfList,
                    inputs: {
                        "INDEX": getScratchType(ScratchType.number, 1)
                    },

                    fields: {
                        "LIST": [
                            listName,
                            listName,
                        ]
                    }
                })
            })
        })
    }),

    clear: createFunction({
        minArgs: 1,
        argTypes: ["StringLiteral"],
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let listName = (callExpression.arguments[0] as StringLiteral).value

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.DataDeleteAllOfList,
                    fields: {
                        "LIST": [
                            listName,
                            listName,
                        ]
                    }
                })
            })
        })
    }),

    insert: createFunction({
        minArgs: 3,
        argTypes: ["StringLiteral"],
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let listName = (callExpression.arguments[0] as StringLiteral).value;

            let args = callExpression.arguments;
            let indexID = uuid(includes.scratch_alphanumeric, 16);
            let itemID = uuid(includes.scratch_alphanumeric, 16);
            let evaluatedIndex = evaluate(args[1].type, blockCluster, args[1], indexID, buildData);
            let evaluatedItem =evaluate(args[2].type, blockCluster, args[2], itemID, buildData);

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.DataInsertAtList,
                    inputs: {
                        "ITEM": evaluatedItem.block,
                        "INDEX": evaluatedIndex.block,
                    },

                    fields: {
                        "LIST": [
                            listName,
                            listName,
                        ]
                    }
                })
            })
        })
    }),

    deleteIndex: createFunction({
        minArgs: 2,
        argTypes: ["StringLiteral"],
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let listName = (callExpression.arguments[0] as StringLiteral).value;

            let args = callExpression.arguments;
            let indexID = uuid(includes.scratch_alphanumeric, 16);
            let evaluatedIndex = evaluate(args[1].type, blockCluster, args[1], indexID, buildData);

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.DataDeleteOfList,
                    inputs: {
                        "INDEX": evaluatedIndex.block,
                    },

                    fields: {
                        "LIST": [
                            listName,
                            listName,
                        ]
                    }
                })
            })
        })
    }),

    replace: createFunction({
        minArgs: 3,
        argTypes: ["StringLiteral"],
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let listName = (callExpression.arguments[0] as StringLiteral).value;

            let args = callExpression.arguments;
            let indexID = uuid(includes.scratch_alphanumeric, 16);
            let itemID = uuid(includes.scratch_alphanumeric, 16);
            let evaluatedIndex = evaluate(args[1].type, blockCluster, args[1], indexID, buildData);
            let evaluatedItem =evaluate(args[2].type, blockCluster, args[2], itemID, buildData);

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.DataReplaceItemOfList,
                    inputs: {
                        "ITEM": evaluatedItem.block,
                        "INDEX": evaluatedIndex.block,
                    },

                    fields: {
                        "LIST": [
                            listName,
                            listName,
                        ]
                    }
                })
            })
        })
    }),

    show: createFunction({
        minArgs: 1,
        argTypes: ["StringLiteral"],
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let listName = (callExpression.arguments[0] as StringLiteral).value

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.DataShowList,

                    fields: {
                        "LIST": [
                            listName,
                            listName,
                        ]
                    }
                })
            })
        })
    }),

    hide: createFunction({
        minArgs: 1,
        argTypes: ["StringLiteral"],
        doParse: false,
        body: ((parsedArguments: typeData[], callExpression: CallExpression, blockCluster: BlockCluster, parentID: string, buildData) => {
            let listName = (callExpression.arguments[0] as StringLiteral).value

            blockCluster.addBlocks({
                [parentID]: createBlock({
                    opcode: BlockOpCode.DataHideList,

                    fields: {
                        "LIST": [
                            listName,
                            listName,
                        ]
                    }
                })
            })
        })
    }),
}