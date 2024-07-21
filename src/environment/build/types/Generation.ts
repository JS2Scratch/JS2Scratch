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

import { ScratchBlock } from "../../../class/Sprite";

export interface GenerationParams {
    index: number,
    ast: any,
    blocks: {
        [x: string]: ScratchBlock;
    },

    key: string
}

export interface NodeResult {
    Block: ScratchBlock,
    AdditionalBlocks?: {
        [key: string]: ScratchBlock
    },

    Terminate?: boolean,
}