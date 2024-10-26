/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : tree-optimise/util/program.ts
* Description       : Utilisation for programs
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 26/10/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { blocksGroup } from "..";
import { ScratchInput } from "../../../util/scratch-type";
import { Block, BlockOpCode } from "../../../util/types";
import { isBlock, isBlockKey } from "./type";

function getRecursiveInput(program: blocksGroup, input: ScratchInput): ScratchInput {
    if (isBlock(input)) {
        const blockKey = isBlockKey(input);
        if (blockKey && program[blockKey]) {
            const clonedBlock = JSON.parse(JSON.stringify(program[blockKey])) as any;

            const inputValues = Object.entries(clonedBlock.inputs);
            inputValues.forEach(([key, v]: [string, ScratchInput]) => {
                clonedBlock.inputs[key] = getRecursiveInput(program, v);
            });

            return [input[0], clonedBlock];
        }
    } else {
        return JSON.parse(JSON.stringify(input));
    }
}

function deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== typeof obj2 || obj1 == null || obj2 == null) return false;

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) return false;
        return obj1.every((element, index) => deepEqual(element, obj2[index]));
    }

    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) return false;

        return keys1.every(key => deepEqual(obj1[key], obj2[key]));
    }

    return false;
}

export function isEq(program: blocksGroup, leftInput: ScratchInput, rightInput: ScratchInput): boolean {
    return deepEqual(getRecursiveInput(program, leftInput) , getRecursiveInput(program, rightInput))
}

export function tryEq(program: blocksGroup, block: Block) {
    switch(block.opcode) {
        case BlockOpCode.OperatorEquals: {
            return isEq(program, block.inputs["OPERAND1"], block.inputs["OPERAND2"])
        }

        default: {
            return false;
        }
    }
}