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
 * Takes a plain Babel value and converts it into the correct scratch value.
 */

import { existsSync } from "fs";
import { join } from "path";

export function evaluate(Value: any, ParentID: string, OriginalSource: string) {
    let scratchType = Value.type;
    let file = join(__dirname, "types", scratchType + ".ts");
    
    if (!existsSync(file)) return;

    return require(file)(Value, ParentID, OriginalSource)
}