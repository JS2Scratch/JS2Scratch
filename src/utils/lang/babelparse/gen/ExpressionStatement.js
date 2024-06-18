const block = require("../../../scratch/block")
const error = require("../util/error")
const parseExpression = require('../util/parseExpression')

let libs = {
    "console": {
        "log": ((args, index, fn) => {

            const { blocks, reference } = parseExpression(args[0], index, fn)

            return [
                block.createBlock(
                    block.enum.looks.SayForSeconds,
                    null,
                    null,
                    {
                        "MESSAGE": reference,
                        "SECS": [
                            1,
                            [
                                4,
                                "1"
                            ]
                        ]
                    },
                    {},
                    false,
                    false,
                    0,
                    0
                ),

                blocks

            ]
        }),

        "error": ((args, index, fn) => {
            const { blocks, reference } = parseExpression(args[0], index, fn)

            return [
                block.createBlock(
                    block.enum.looks.Say,
                    null,
                    null,
                    {
                        "MESSAGE": reference,
                    },
                    {},
                    false,
                    false,
                    0,
                    0
                ),

                blocks

            ]
        }),
    },

    "motion": {
        "movesteps": ((args, index, fn) => {
            const { blocks, reference } = parseExpression(args[0], index, fn)

            return [
                block.createBlock(
                    block.enum.motion.MoveSteps,
                    null,
                    null,
                    {
                        "STEPS": reference,
                    },
                    {},
                    false,
                    false,
                    0,
                    0
                ),

                blocks

            ]
        }),

        "turnright": ((args, index, fn) => {
            const { blocks, reference } = parseExpression(args[0], index, fn)

            return [
                block.createBlock(
                    block.enum.motion.TurnRight,
                    null,
                    null,
                    {
                        "DEGREES": reference,
                    },
                    {},
                    false,
                    false,
                    0,
                    0
                ),

                blocks

            ]
        }),

        "turnleft": ((args, index, fn) => {
            const { blocks, reference } = parseExpression(args[0], index, fn)

            return [
                block.createBlock(
                    block.enum.motion.TurnLeft,
                    null,
                    null,
                    {
                        "DEGREES": reference,
                    },
                    {},
                    false,
                    false,
                    0,
                    0
                ),

                blocks

            ]
        }),

        "goto": ((args, index, fn) => {
            const { blocks: leftBlocks, reference: leftReference } = parseExpression(args[0], index, fn);
            const { blocks: rightBlocks, reference: rightReference } = parseExpression(args[1], index, fn);

            return [
                block.createBlock(
                    block.enum.motion.GotoCoords,
                    null,
                    null,
                    {
                        "X": leftReference,
                        "Y": rightReference,
                    },
                    {},
                    false,
                    false,
                    0,
                    0
                ),

                Object.assign(leftBlocks || {}, rightBlocks || {})

            ]
        }),

        "tween": ((args, index, fn) => {

            const { blocks: timeBlocks, reference: timeReference } = parseExpression(args[0], index, fn);
            const { blocks: leftBlocks, reference: leftReference } = parseExpression(args[1], index, fn);
            const { blocks: rightBlocks, reference: rightReference } = parseExpression(args[2], index, fn);

            return [
                block.createBlock(
                    block.enum.motion.TweenTimeToCoords,
                    null,
                    null,
                    {
                        "SECS": timeReference,
                        "X": leftReference,
                        "Y": rightReference,
                    },
                    {},
                    false,
                    false,
                    0,
                    0
                ),

                Object.assign( Object.assign(leftBlocks || {}, rightBlocks || {}), timeBlocks)
               

            ]
        }),

        "point": ((args, index, fn) => {
            const { blocks, reference } = parseExpression(args[0], index, fn)

            return [
                block.createBlock(
                    block.enum.motion.PointInDirection,
                    null,
                    null,
                    {
                        "DIRECTION": reference,
                    },
                    {},
                    false,
                    false,
                    0,
                    0
                ),

                blocks

            ]
        }),

        
        "changeX": ((args, index, fn) => {
            const { blocks, reference } = parseExpression(args[0], index, fn)

            return [
                block.createBlock(
                    block.enum.motion.ChangeX,
                    null,
                    null,
                    {
                        "DX": reference,
                    },
                    {},
                    false,
                    false,
                    0,
                    0
                ),

                blocks

            ]
        }),

        "changeY": ((args, index, fn) => {
            const { blocks, reference } = parseExpression(args[0], index, fn)

            return [
                block.createBlock(
                    block.enum.motion.ChangeY,
                    null,
                    null,
                    {
                        "DY": reference,
                    },
                    {},
                    false,
                    false,
                    0,
                    0
                ),

                blocks

            ]
        }),

        "setX": ((args, index, fn) => {
            const { blocks, reference } = parseExpression(args[0], index, fn)

            return [
                block.createBlock(
                    block.enum.motion.SetX,
                    null,
                    null,
                    {
                        "X": reference,
                    },
                    {},
                    false,
                    false,
                    0,
                    0
                ),

                blocks

            ]
        }),

        "setY": ((args, index, fn) => {
            const { blocks, reference } = parseExpression(args[0], index, fn)

            return [
                block.createBlock(
                    block.enum.motion.SetY,
                    null,
                    null,
                    {
                        "Y": reference,
                    },
                    {},
                    false,
                    false,
                    0,
                    0
                ),

                blocks

            ]
        }),

        "bounce": (() => {
            return [
                block.createBlock(
                    block.enum.motion.Bounce0nEdge,
                    null,
                    null,
                    {},
                    {},
                    false,
                    false,
                    0,
                    0
                ),

                {}

            ]
        })
    },

    "control": {
        "wait": ((args, index, fn) => {
            const { blocks, reference } = parseExpression(args[0], index, fn)

            return [
                block.createBlock(
                    block.enum.control.Wait,
                    null,
                    null,
                    {
                        "DURATION": reference,
                    },
                    {},
                    false,
                    false,
                    0,
                    0
                ),

                blocks

            ]
        })
    }
}

module.exports = ((node, index, isLast, ast, filename) => {

    let calleeObject = node.expression.callee
    let libName = calleeObject.object.name
    let funcName = calleeObject.property.name

    let arguments = node.expression.arguments

    if (!libs[libName] || !libs[libName][funcName])
    {
        return error.throw(
            error.enum.InvalidArguments,
            `${filename}: Unknown library / function, got: '${libName}.${funcName}'`
        )
    }

    let blockData = libs[libName || "console"][funcName || "log"](arguments, index, filename)

    return {
        Code: blockData[0],
        AdditionalCode: blockData[1] || {},
        Variables: {},
        Skip: 0
    };
});

