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
import { getScratchType, ScratchType } from '../../util/scratchType'

module.exports = ((UpdateExpression: { [key: string]: any }, OriginalSource: string, ParentID: string) => {
    UpdateExpression = UpdateExpression.expression;

    if (UpdateExpression.argument.type != "Identifier") return {};

    let key = uuid(includes.scratch_alphanumeric);

    switch (UpdateExpression.operator) {
        case "++":
            return {
                Block: createBlock({
                    opcode: BlockOpCode.DataChangeVariableBy,
                    inputs: {
                        "VALUE": getScratchType(ScratchType.number, "1")
                    },

                    fields: {
                        "VARIABLE": [
                            UpdateExpression.argument.name,
                            UpdateExpression.argument.name,
                        ]
                    }
                })
            }

        case "--":
            return {
                Block: createBlock({
                    opcode: BlockOpCode.DataChangeVariableBy,
                    inputs: {
                        "VALUE": getScratchType(ScratchType.number, "-1")
                    },

                    fields: {
                        "VARIABLE": [
                            UpdateExpression.argument.name,
                            UpdateExpression.argument.name,
                        ]
                    }
                })
            }
    }

})