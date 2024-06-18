const block = require("../../../scratch/block")
const parseExpression = require('../util/parseExpression')

module.exports = ((node, index, isLast, ast, filename) => {
    const { blocks, reference } = parseExpression(node.init, index, filename);

    return {
        Code: block.createBlock(
            block.enum.variable.SetVariable,
            null,
            null,
            {
                "VALUE": reference
            },
            {
                "VARIABLE": [
                    node.id.name,
                    node.id.name, // The ID is the same as the name :P
                ]
            },
            false,
            false,
            0,
            0
        ),
        AdditionalCode: blocks || {},
        Variables: {
            [node.id.name]: [
                node.id.name,
                0
            ]
        },
        Skip: 2
    };
});

