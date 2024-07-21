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
 * Parses a substack.
 */

import { GenerationParams } from "../types/Generation";
import * as build from "../build";

export function parseSubstack(Parameters: GenerationParams, specificNode: any, fileName: string) {
    // This indeed means we need to parse everything; AGAIN! Change this in the future.
    
    //const bodySrc = OriginalSource.substring(specificNode.start + 1, specificNode.end - 1); // The source of the body
    let bodySrc = specificNode;
    let bodyBlocks = build.transpileFromSource(bodySrc, fileName); // We need to remove the flag.

    // Remove the flag & change the next blocks parent.
    let flagObject = bodyBlocks[Object.keys(bodyBlocks)[0]];
    if (flagObject.next) {
        bodyBlocks[flagObject.next].parent = Parameters.key;
    }

    delete bodyBlocks[Object.keys(bodyBlocks)[0]];
    return {
        blocks: bodyBlocks,
        startIndex: Object.keys(bodyBlocks)[0]
    }
}
