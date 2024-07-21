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
 * Parses a substack without modifying it.
 */

import * as build from "../build";

export function parseSubstackWithoutModification(Value: any, parentID: string, filename: string) {
    let buildBlocks = build.transpileFromSource(Value, filename);

    let flagObject = buildBlocks[Object.keys(buildBlocks)[0]];
    if (flagObject.next) {
        buildBlocks[flagObject.next].parent = parentID;
    }

    delete buildBlocks[Object.keys(buildBlocks)[0]];

    return buildBlocks
}