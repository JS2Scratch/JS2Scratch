/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : AssignmentExpression.ts
* Description       : Creates an assignment expression
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { BlockCluster, createBlock } from "../util/blocks";
import { AssignmentExpression } from "@babel/types"
import { BlockOpCode, buildData } from "../util/types";
import { uuid, includes } from "../util/scratch-uuid"
import { getBlockNumber, getVariable } from "../util/scratch-type";
import { evalutate } from "../util/evaluate";

module.exports = ((BlockCluster: BlockCluster, AssignmentExpression: AssignmentExpression, buildData: buildData) => {

    let keysGenerated: string[] = [];
    let ID = uuid(includes.scratch_alphanumeric, 16);

    keysGenerated.push(ID);

    let newValue = evalutate(AssignmentExpression.right.type, BlockCluster, AssignmentExpression.right, ID, buildData)
    switch (AssignmentExpression.operator) {
        case "=":
            BlockCluster.addBlocks({
                [ID]: createBlock({
                    opcode: BlockOpCode.DataSetVariableTo,
                    inputs: {
                        "VALUE": newValue.block
                    },

                    fields: {
                        "VARIABLE": [
                            (AssignmentExpression as any).left.name,
                            (AssignmentExpression as any).left.name,
                        ]
                    }
                }),
            });

            break;
        case "+=":
        case "-=":
            if (AssignmentExpression.operator == "-=") {
                let value = newValue.block[1][1];
                newValue.block[1][1] = String(-parseFloat(value) || "");
            }

            BlockCluster.addBlocks({
                [ID]: createBlock({
                    opcode: BlockOpCode.DataChangeVariableBy,
                    inputs: {
                        "VALUE": newValue.block
                    },

                    fields: {
                        "VARIABLE": [
                            (AssignmentExpression as any).left.name,
                            (AssignmentExpression as any).left.name,
                        ]
                    }
                })
            })
            break;

        case "*=":
        case "/=":
            let id = uuid(includes.scratch_alphanumeric);

            BlockCluster.addBlocks({
                [ID]: createBlock({
                    opcode: BlockOpCode.DataSetVariableTo,
                    inputs: {
                        "VALUE": getBlockNumber(id)
                    },

                    fields: {
                        "VARIABLE": [
                            (AssignmentExpression as any).left.name,
                            (AssignmentExpression as any).left.name,
                        ]
                    }
                }),

                [id]: createBlock({
                    opcode: AssignmentExpression.operator == "*=" ? BlockOpCode.OperatorMultiply : BlockOpCode.OperatorDivide,
                    parent: ID,
                    inputs: {
                        "NUM1": getVariable((AssignmentExpression as any).left.name),
                        "NUM2": newValue.block
                    }
                })
            });

            break;

    };

    return { keysGenerated }
})