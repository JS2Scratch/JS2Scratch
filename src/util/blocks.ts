/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : blocks.ts
*
* Description       : Creates Scratch-AST
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 13/09/2024	saaawdust	Created file, setup environment
*
/******************************************************************/

import { Block, BlockOpCode, Mutation } from "./types";

export class BlockCluster {
    blocks: {[key: string]: Block} = {};

    constructor(inbuiltBlocks?: {[key: string]: Block})
    {
        this.blocks = inbuiltBlocks || {};
    }

    addBlocks(blocks: {[key: string]: Block})
    {
        this.blocks = {
            ...this.blocks,
            ...blocks
        };
    }
}

export function createBlock({
    opcode = BlockOpCode.EventWhenFlagClicked, // The Block
    next = null, // The next Block
    parent = null, // The previous Block
    inputs = {}, // User-Defined Inputs
    fields = {}, // User-Defined Fields
    shadow = false, // Rendering
    topLevel = false, // If the block is at the top of a chain
    x = 0, // X Pos
    y = 0, // Y Pos
}: Partial<Block | Mutation> = {}): Block
{
    return {
        opcode: opcode,
        next: next,
        parent: parent,
        inputs: inputs,
        fields: fields,
        shadow: shadow,
        topLevel: topLevel,
        x: x,
        y: y,
    }
}

export function createMutation({
    opcode = BlockOpCode.EventWhenFlagClicked, // The Block
    next = null, // The next Block
    parent = null, // The previous Block
    inputs = {}, // User-Defined Inputs
    fields = {}, // User-Defined Fields
    shadow = false, // Rendering
    topLevel = false, // If the block is at the top of a chain
    x = 0, // X Pos
    y = 0, // Y Pos,
    mutation = {},
}: Partial<Mutation> = {}): Mutation
{
    return {
        opcode: opcode,
        next: next,
        parent: parent,
        inputs: inputs,
        fields: fields,
        shadow: shadow,
        topLevel: topLevel,
        x: x,
        y: y,
        mutation: mutation
    }
}

export function isSpiky(opCode: BlockOpCode)
{  
    const spikyBlocks = [
        BlockOpCode.SensingTouchingColor,
        BlockOpCode.SensingTouchingObject,
        BlockOpCode.SensingColorIsTouchingColor,
        BlockOpCode.SensingKeyPressed,
        BlockOpCode.SensingMouseDown,

        BlockOpCode.OperatorGreaterThan,
        BlockOpCode.OperatorLessThan,
        BlockOpCode.OperatorEquals,
        BlockOpCode.OperatorAnd,
        BlockOpCode.OperatorOr,
        BlockOpCode.OperatorNot,
        BlockOpCode.OperatorContains,
    ];

    return spikyBlocks.includes(opCode);
}

export function isSpikyType(lib: string, fn: string)
{  
    // These functions return booleans.
    const spikyFn: {[key: string]: string[]} = {
        "operation": [
            "stringContains"
        ],

        "sensing": [
            "touching",
            "touchingColor",
            "colorIsTouchingColor",
            "mouseDown",
            "keyDown",
        ]
    };

    return spikyFn[lib] && spikyFn[lib].includes(fn);
}