
const block = require("../../../scratch/block")
const parseExpression = require("../util/parseExpression")
const transpile = require('../../transpile')
const UUID = require('../util/genUUID')

module.exports = ((node, index, isLast, ast, filename) => {

    let { blocks, reference } = parseExpression(node.test, index, filename)

    // Only supports BlockStatements
    let body = node.consequent.body
    let blockStatementBody = {
        type: 'File',
        program: {
            type: 'Program',
            start: 0,
            end: 0,
            sourceType: "module",
            interpreter: null,
            body: body,
            directives: []
        }
    }


    let transpiledCode = transpile(blockStatementBody, filename, true)
    delete transpiledCode[0]['0'] // Delete 'onflagclicked'

    let indexToSkip = transpiledCode[transpiledCode.length-1] + Object.keys(blocks).concat(Object.keys(reference)).length + 3


    let previous = null
    let previousObject = null
    let firstIndex = null
    for (let key in transpiledCode[0]) {
        if (typeof key === 'string' && !isNaN(key)) {
            const newKey = UUID();
    
            transpiledCode[0][newKey] = transpiledCode[0][key];

            if (previousObject === null && previous === null)
                {
                    firstIndex = newKey
                    transpiledCode[0][newKey].parent = String(index)
                }
    
            if (transpiledCode[0][newKey].parent !== null && previous !== null) {
                transpiledCode[0][newKey].parent = String(previous);
            }

            if (previousObject && previousObject.next !== null) {
                previousObject.next = String(newKey);
            }
    
            if (key !== newKey.toString()) {
                delete transpiledCode[0][key];
            }

            previous = newKey
            previousObject = transpiledCode[0][newKey]
        }
    }
    


    let substack = null

    if (firstIndex !== null)
    {
        substack = [
            2,
            firstIndex
        ]
    }


   if (substack !== null)
    {
        return {
            Code: block.createBlock(
                block.enum.control.If,
                null,
                null,
                {
                    "CONDITION": reference,
                    "SUBSTACK": substack
                },
                {},
                false,
                false,
                0,
                0
            ),
            Skip: indexToSkip,
            AdditionalCode: Object.assign(blocks, transpiledCode[0])
        }
    } else {
        return {
            Code: block.createBlock(
                block.enum.control.If,
                null,
                null,
                {
                    "CONDITION": reference,
                },
                {},
                false,
                false,
                0,
                0
            ),
            Skip: indexToSkip,
            AdditionalCode: Object.assign(blocks, transpiledCode[0])
        }
    }
})
