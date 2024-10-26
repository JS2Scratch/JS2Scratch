/* This file is an OPTIMISATION file.
   The name of the file represents what
   the file is optimising.
*/

import { blockData, blockDataType, blocksGroup, optimiseTypes } from "../../index";
import { getBlockNumber, getScratchType, ScratchInput, ScratchType } from "../../../../util/scratch-type";
import { getValue, isBlock, isBlockKey, isNumericValue, isNumericValueInvert } from "../../util/type";
import { Block, BlockOpCode } from "../../../../util/types";
import { includes, uuid } from "../../../../util/scratch-uuid";
import { createBlock } from "../../../../util/blocks";

function addLeftovers(program: blocksGroup, block: Block, r = false) {
    if (r && block.opcode != BlockOpCode.OperatorAdd) return 0;

    let inputValues = Object.values(block.inputs);

    let totalAddition = 0;
    inputValues.forEach((v) => {
        let possibleValue = isNumericValue(v);
        let isVBlock = isBlock(v);

        if (possibleValue) {
            totalAddition += possibleValue
            v[1][1] = 0
        } else if (isVBlock) {
            let blockKey = isBlockKey(v);
            totalAddition += addLeftovers(program, program[blockKey], true);
        }
    })

    return totalAddition
}

function simplifyZero(program: blocksGroup, block: Block, parent: Block, parentKey: string) {
    if (block.opcode !== BlockOpCode.OperatorAdd) return;

    const inputs = Object.values(block.inputs);
    const inputKeys = Object.keys(block.inputs);

    let deleteThis;
    let forceNotRemoveTillAfter = false;
    inputs.forEach((v: ScratchInput, index: number) => {
        const possibleValue = isNumericValueInvert(v);

        if (possibleValue != null && possibleValue == 0) {
            const nonZeroKey = inputKeys.find(key => key != inputKeys[index]);

            deleteThis = isBlockKey(parent.inputs[parentKey])
            parent.inputs[parentKey] = block.inputs[nonZeroKey];
        } else {
            let possibleKey = isBlockKey(v);
            if (possibleKey) {
                simplifyZero(program, program[possibleKey], block, inputKeys[index]);
                forceNotRemoveTillAfter = true;
            }
        }
    });

    if (deleteThis) {
        if (forceNotRemoveTillAfter) {
            block.opcode = BlockOpCode.JS2Scratch_Unknown;
        } else {
            delete program[deleteThis];
        }
    }
}

function functions(program: blocksGroup, parent: blockData, type: blockDataType) {
    if (type.inputBlocks.length == 0) {
        let left = Number(getValue(type.block.inputs["NUM1"]));
        let right = Number(getValue(type.block.inputs["NUM2"]));

        if (!isNaN(left) && !isNaN(right)) {
            parent.block[type.originalArea][type.originalKey] = getScratchType(ScratchType.number, left - right);
            delete program[type.key];
            return { block: parent.block, program };
        }

        return { block: type.block, program };
    } else {

        if (isBlock(type.block.inputs["NUM1"])) {
            const leftType = type.inputBlocks.find(item => item.originalKey === "NUM1");
            optimiseTypes(program, type, (leftType as blockDataType))
        }

        if (isBlock(type.block.inputs["NUM2"])) {
            const leftType = type.inputBlocks.find(item => item.originalKey === "NUM2");
            optimiseTypes(program, type, (leftType as blockDataType))
        }

        const leftValue = isNumericValue(type.block.inputs["NUM1"]);
        const rightValue = isNumericValue(type.block.inputs["NUM2"]);

        if (leftValue != null && rightValue != null) {
            parent.block[type.originalArea][type.originalKey] = getScratchType(
                ScratchType.number,
                leftValue - rightValue
            );
            delete program[type.key];
            return { block: parent.block, program };
        }
        
        let leftovers = addLeftovers(program, parent.block);
        simplifyZero(program, type.block, parent.block, type.originalKey);

        let finalAdditionID = uuid(includes.scratch_alphanumeric, 16);

        program[finalAdditionID] = createBlock({
            opcode: BlockOpCode.OperatorAdd,
            inputs: {
                ["NUM1"]: getScratchType(ScratchType.number, leftovers),
                ["NUM2"]: parent.block.inputs[type.originalKey]
            }
        });

        parent.block.inputs[type.originalKey] = getBlockNumber(finalAdditionID);
        
        return { block: parent.block, program };
    }
}

module.exports = functions