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
 * This ones a bit hacky. There is no "for"
 * loop in scratch, so we need to make our own
 * implementation.
 */

import { BlockOpCode } from "../../../class/Sprite";
import { errorMessages } from "../../../lib/console";
import { createBlock } from "../../../template/block";
import { GenerationParams, NodeResult } from "../types/Generation";
import { evaluate } from "../util/evaluateValue";
import { parseSubstack } from '../util/parseSubstack'
import * as build from "../build";
import { includes, uuid } from "../../../lib/scratch-uuid";
import { parseSubstackWithoutModification } from "../util/parseSubstackWithoutModification"

// Don't use parse substack.
let getScratchBlocksFromValue = parseSubstackWithoutModification;

// JS Syntax required
module.exports = ((Parameters: GenerationParams, OriginalSource: string): NodeResult | undefined => {
    let specificNode = Parameters.ast[Parameters.index];

    let varDeclared = specificNode.init;

    let endCondition = specificNode.test;
    let update = specificNode.update;

    let fileName = specificNode.loc.filename;

    // Make sure it matches the criteria.
    if (varDeclared.type != "Identifier") {
        errorMessages["First argument of FOR loop is not an identifier"](`file: ${fileName} line: ${specificNode.init.loc.start.line} column: ${specificNode.init.loc.start.column}`)
        return;
    }

    if (endCondition.type != "BinaryExpression" && endCondition.type != "LogicalExpression") {
        errorMessages["Second argument of FOR loop is not a valid expression"](`file: ${fileName} line: ${specificNode.test.loc.start.line} column: ${specificNode.test.loc.start.column}`)
        return;
    }

    if (update.type != "UpdateExpression" && update.type != "AssignmentExpression") {
        errorMessages["Third argument of FOR loop is not an update expression"](`file: ${fileName} line: ${update.loc.start.line} column: ${update.loc.start.column}`)
        return;
    }

    // Evaluate each section.
    let conditionBlocks = evaluate(endCondition, Parameters.key, OriginalSource);
    let updateBlock = getScratchBlocksFromValue(OriginalSource.substring(update.start, update.end), Parameters.key, fileName);

    let substackData = parseSubstack(Parameters, specificNode.body, OriginalSource, fileName);

    let subStartIndex = Object.keys(updateBlock)[0];

    updateBlock[subStartIndex].next = substackData.startIndex || null;
    Object.assign(substackData.blocks, updateBlock);

    let notKey = uuid(includes.scratch_alphanumeric);
    let notWrapper = createBlock({
        opcode: BlockOpCode.OperatorNot,
        parent: Parameters.key,
        inputs: {
            "OPERAND": [
                2,
                conditionBlocks.block[1],
            ]
        }
    });

    let mainFor = createBlock({
        opcode: BlockOpCode.ControlRepeatUntil,
        inputs: {
            "CONDITION": [
                3,
                notKey,
                [
                    4,
                    ""
                ]
            ],
            "SUBSTACK": [2, subStartIndex],
        }
    })

    let forAdditional = {
        ...conditionBlocks.additionalBlocks,
        ...substackData.blocks,
        [notKey]: notWrapper,
    }

    return {
        Block: mainFor,
        AdditionalBlocks: forAdditional,
    }
})