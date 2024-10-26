/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : tree-optimise/index.ts
* Description       : Entry point
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 26/10/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { existsSync } from "fs";
import { ScratchInput } from "../../util/scratch-type";
import { Block, BlockOpCode } from "../../util/types";
import { join } from "path";

export type blocksGroup = { [key: string]: Block }

export type blockData = {
    ["block"]: Block,
    ["key"]: string,
    ["inputBlocks"]: blockDataType[],
    ["fieldBlocks"]: blockDataType[]
}

export type blockDataType = {
    ["block"]: Block,
    ["originalKey"]: string,
    ["originalArea"]: string,
    ["key"]: string,
    ["inputBlocks"]: blockDataType[],
    ["fieldBlocks"]: blockDataType[]
}

let HEADER_BLOCKS = [
    BlockOpCode.EventWhenFlagClicked,
    BlockOpCode.EventWhenBackdropSwitchesTo,
    BlockOpCode.EventWhenBroadcastReceived,
    BlockOpCode.EventWhenGreaterThan,
    BlockOpCode.EventWhenKeyPressed,
    BlockOpCode.EventWhenStageClicked,
    BlockOpCode.EventWhenThisSpriteClicked,
    BlockOpCode.ProceduresDefinition,
]

function getInputField(Blocks: blocksGroup, Key: string, Block: Block, originalKey: string = "", originalArea: string = ""): blockDataType {
    let inputValues = Object.values(Block.inputs);
    let fieldValues = Object.values(Block.fields);

    let inputKeys = Object.keys(Block.inputs);
    let fieldKeys = Object.keys(Block.fields);

    let blockData: blockDataType = {
        block: Block,
        key: Key,
        originalKey,
        originalArea,
        fieldBlocks: [],
        inputBlocks: []
    };

    inputValues.forEach((v: ScratchInput, i) => {
        if (typeof(v) != "undefined" && v[0] == 3 && typeof (v[1]) == "string") {
            blockData.inputBlocks.push(getInputField(Blocks, v[1], Blocks[v[1]], inputKeys[i], "inputs"))
        }
    });

    fieldValues.forEach((v: ScratchInput, i) => {
        if (typeof(v) != "undefined" && v[0] == 3 && typeof (v[1]) == "string") {
            blockData.fieldBlocks.push(getInputField(Blocks, v[1], Blocks[v[1]], fieldKeys[i], "fields"))
        }
    });

    return blockData
}

export function optimiseTypes(program: blocksGroup, parent: blockData, type: blockData): {[key: string]: any} {
    let typeBlock = type.block;
    let opcode = typeBlock.opcode;
    let split = opcode.split("_");
    let category = split[0];

    split.shift()

    let name = split.join("_");
    let path = join(__dirname, 'types', category, name + ".ts");

    
    if (existsSync(path)) {
        let data = require(path)(program, parent, type);
        return data
    }

    return { block: parent.block }
}

function createTree(program: blocksGroup): blockData[][] {
    let values = Object.values(program);
    let keys = Object.keys(program);

    let blocks: blockData[][] = [];

    for (let i = 0; i < values.length; i++) {
        let block = values[i];

        if (HEADER_BLOCKS.includes(block.opcode)) {
            let newBlockGroup: blockData[] = [];
            let next = block.next;

            newBlockGroup.push(getInputField(program, keys[i], block));

            while (next != null) {
                let nextBlock = program[next];
                newBlockGroup.push(getInputField(program, next, nextBlock));

                next = nextBlock.next;
            }

            blocks.push(newBlockGroup);
        }
    }

    return blocks
}

export function treeOptimise(program: blocksGroup): blocksGroup {
    let tree = createTree(program);

    tree.forEach((sequence) => {
        sequence.forEach((block) => {
            let realBlock = block.block;
            let opcode = realBlock.opcode;
            let split = opcode.split("_");
            let category = split[0];

            split.shift()

            let name = split.join("_");
            let path = join(__dirname, 'blocks', category, name + ".ts");
            if (existsSync(path)) {
                let data = require(path)(program, block);
                if (data.program) program = data.program;
                program[block.key] = data.block;
            }

            block.inputBlocks.forEach((v) => {
                let data = optimiseTypes(program, block, v);
                if (data.program) program = data.program
                program[block.key] = data.block
            })

            block.fieldBlocks.forEach((v) => {
                let data = optimiseTypes(program, block, v);
                if (data.program) program = data.program
                program[block.key] = data.block
            })
        })
    });

    let finalProgram: blocksGroup = {};
    for (const [key, value] of Object.entries(program)) {
        if (value.opcode != BlockOpCode.JS2Scratch_Unknown) {
            finalProgram[key] = value;
        }
    }

    return finalProgram
}
