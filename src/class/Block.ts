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

function isFunctionCurveBlock(Block: any): boolean {
    if (Block.type != "CallExpression") { return false; }
    
    let valid = [
        "touching",
        "touchingColor",
        "colorIsTouchingColor",
        "mouseDown",
        "keyDown",
        "stringContains"
    ]

    return valid.includes(Block.callee.property.name)
}

export { isFunctionCurveBlock }