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
 * Evaluates an assignment expression.
 */

import { BlockOpCode } from '../../../../class/Sprite';
import { includes, uuid } from '../../../../lib/scratch-uuid';
import { createBlock } from '../../../../template/block';
import { evaluate } from '../../util/evaluateValue';
import { getBlockNumber, getVariable, ScratchType } from '../../util/scratchType'

module.exports = ((AssignmentExpression: { [key: string]: any }, OriginalSource: string, ParentID: string) => {
    AssignmentExpression = AssignmentExpression.expression;

    if (AssignmentExpression.left.type != "Identifier") return {};

    let key = uuid(includes.scratch_alphanumeric);
    let newValue = evaluate(AssignmentExpression.right, key, OriginalSource);

    switch (AssignmentExpression.operator) {
        case "=":
            return {
                Block: createBlock({
                    opcode: BlockOpCode.DataSetVariableTo,
                    inputs: {
                        "VALUE": newValue.block
                    },

                    fields: {
                        "VARIABLE": [
                            AssignmentExpression.left.name,
                            AssignmentExpression.left.name,
                        ]
                    }
                }),

                AdditionalBlocks: newValue.additionalBlocks
            }

        case "+=":
        case "-=":
            if (AssignmentExpression.operator == "-=") {
                let value = newValue.block[1][1];
                newValue.block[1][1] = String(-parseFloat(value) || "");
            }

            return {
                Block: createBlock({
                    opcode: BlockOpCode.DataChangeVariableBy,
                    inputs: {
                        "VALUE": newValue.block
                    },

                    fields: {
                        "VARIABLE": [
                            AssignmentExpression.left.name,
                            AssignmentExpression.left.name,
                        ]
                    }
                }),

                AdditionalBlocks: newValue.additionalBlocks
            }

        case "*=":
        case "/=":
            let id = uuid(includes.scratch_alphanumeric);

            return {
                Block: createBlock({
                    opcode: BlockOpCode.DataSetVariableTo,
                    inputs: {
                        "VALUE": getBlockNumber(id)
                    },

                    fields: {
                        "VARIABLE": [
                            AssignmentExpression.left.name,
                            AssignmentExpression.left.name,
                        ]
                    }
                }),

                AdditionalBlocks: {
                    ...newValue.additionalBlocks,
                    [id]: createBlock({
                        opcode: AssignmentExpression.operator == "*=" ? BlockOpCode.OperatorMultiply : BlockOpCode.OperatorDivide,
                        parent: ParentID,
                        inputs: {
                            "NUM1": getVariable(ScratchType.variable, AssignmentExpression.left.name),
                            "NUM2": newValue.block
                        }
                    })
                }
            }

    };
})