/**
 * ShadowX
 * 
 * Part of the "JS2Scratch" Project
 * 
 * [2024]
 * [ Made with love <3 ]
 *
 * @lisence MIT
 */

import * as sprite from '../class/Sprite'

export function createBlock({
    opcode = sprite.BlockOpCode.EventWhenFlagClicked, // The Block
    next = null, // The next Block
    parent = null, // The previous Block
    inputs = {}, // User-Defined Inputs
    fields = {}, // User-Defined Fields
    shadow = false, // Rendering
    topLevel = false, // If the block is at the top of a chain
    x = 0, // X Pos
    y = 0, // Y Pos
    mutation = undefined,
}: Partial<sprite.ScratchBlock> = {}): sprite.ScratchBlock {
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