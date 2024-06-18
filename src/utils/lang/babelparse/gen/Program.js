const block = require("../../../scratch/block")

module.exports = ((node, index, isLast, ast, filename) => {
    return {
        Code: block.createBlock(
            block.enum.events.GreenFlag,
            null,
            null,
            {},
            {},
            false,
            true,
            0,
            0
        ),
        Skip: 0
    }
})
