/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : WhileStatement.ts
* Description       : Creates a While Statement
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { BlockCluster, createBlock } from "../util/blocks";
import { WhileStatement, SourceLocation } from "@babel/types"
import { BlockOpCode, buildData } from "../util/types";
import { parseProgram } from "../env/parseProgram";
import { includes, uuid } from "../util/scratch-uuid";
import { evaluate } from "../util/evaluate";
import { getBlockNumber, getScratchType, getSubstack, ScratchType } from "../util/scratch-type";

function parseWhile(Block_Cluster: BlockCluster, WhileStatement: WhileStatement, buildData: buildData) {
    let keysGenerated: string[] = [];
    let id = uuid(includes.scratch_alphanumeric, 16);

    keysGenerated.push(id);
    let substackA = parseProgram((WhileStatement.body as any), (WhileStatement.loc as SourceLocation).filename, false, buildData.packages)
    for (let i = 0; i < Object.keys(substackA.blocks).length; i++) {
        substackA.blocks[Object.keys(substackA.blocks)[i]].parent = id;
    }

    let evaluated = evaluate(WhileStatement.test.type, Block_Cluster, WhileStatement.test, id, buildData).block;
    let extra: {[key: string]: any} = {};
    if (WhileStatement.test.type != "LogicalExpression" && !(WhileStatement.test.type == "BinaryExpression" && ["<", ">", "==", "===", "!=", "!=="].includes(WhileStatement.test.operator)))
    {
        let sId = uuid(includes.scratch_alphanumeric, 16)
        extra[sId] = createBlock({
            opcode: BlockOpCode.OperatorEquals,
            parent: id,
            inputs: {
                "OPERAND1": evaluated,
                "OPERAND2": getScratchType(ScratchType.number, "1")
            }
        });

        evaluated = getBlockNumber(sId);
    }

    const commonFields = {
        "CONDITION": evaluated,
        "SUBSTACK": substackA.firstIndex !== undefined ? getSubstack(substackA.firstIndex) : undefined,
    }

    let type = BlockOpCode.ControlWhile;
    if (WhileStatement.test.type == "BooleanLiteral" && WhileStatement.test.value == true)
    {
        type = BlockOpCode.ControlForever;
    }

    Block_Cluster.addBlocks({
        [id]: createBlock({
            opcode: type,
            inputs: commonFields
        }),

        ...substackA.blocks,
        ...extra,
    });

    return { keysGenerated, terminate: type == BlockOpCode.ControlForever }
}

module.exports = parseWhile;