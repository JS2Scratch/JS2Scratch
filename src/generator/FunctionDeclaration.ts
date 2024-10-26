/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : FunctionDeclaration.ts
* Description       : Creates a FunctionDeclaration (function foo(bar))
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 25/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { BlockCluster, createBlock, createMutation } from "../util/blocks";
import { FunctionDeclaration } from "@babel/types"
import { Block, BlockOpCode, buildData, typeData } from "../util/types";
import { getBlockNumber, getScratchType, ScratchType } from "../util/scratch-type";
import { uuid, includes } from "../util/scratch-uuid"
import { evaluate } from "../util/evaluate";
import { createGlobal } from "../util/lib-convert";
import { parseProgram } from "../env/parseProgram";

module.exports = ((BlockCluster: BlockCluster, FunctionDeclaration: FunctionDeclaration, buildData: buildData) => {

    let IDs: string[] = [
        uuid(includes.scratch_alphanumeric, 16),
        uuid(includes.scratch_alphanumeric, 16) // proto
    ];

    let inputCodes: string[] = [];
    let innerCodes: string[] = [];
    let inputs: {[key: string]: any} = {};
    let paramBlocks: {[key: string]: any} = {};
    let blockIds = "[";
    let argNames = "[";
    let startedWithTurbo = ((FunctionDeclaration as any).id.name as string).startsWith("turbo_");
    if (startedWithTurbo)
    {
        (FunctionDeclaration as any).id.name = (FunctionDeclaration as any).id.name.substring(6);
    }

    let nbd = JSON.parse(JSON.stringify(buildData));

    for (let i = 0; i < FunctionDeclaration.params.length; i++)
    {
        let arg = FunctionDeclaration.params[i];
        
        inputCodes.push((FunctionDeclaration as any).id.name + "_" + i);
        innerCodes.push(uuid(includes.scratch_alphanumeric, 16));
    
        inputs[inputCodes[i]] = [
            1,
            innerCodes[i]
        ];

        paramBlocks[innerCodes[i]] = createBlock({
            opcode: BlockOpCode.ArgumentReporterStringNumber,
            parent: IDs[1],
            fields: {
                "VALUE": [
                    (arg as any).name,
                    null
                ]
            },
            shadow: true
        })

        let hasNext = (i + 1) <= (FunctionDeclaration.params.length - 1)
        blockIds += `"${inputCodes[i]}"${hasNext && "," || ""}`;
        argNames += `"${(arg as any).name}"${hasNext && "," || ""}`;

        nbd.packages.globals = [
            ...nbd.packages.globals,
            createGlobal((arg as any).name, ((BlockCluster: BlockCluster) => {
                let newId = uuid(includes.scratch_alphanumeric, 16);

                BlockCluster.addBlocks({
                    [newId]: createBlock({
                        opcode: BlockOpCode.ArgumentReporterStringNumber,
                        fields: {
                            "VALUE": [
                                (arg as any).name,
                                null
                            ]
                        },
                    })
                });

                return {
                    block: getBlockNumber(newId)
                }
            }))
        ];

    }

    blockIds += "]";
    argNames += "]";

    
    let body = parseProgram(FunctionDeclaration.body, FunctionDeclaration.loc?.filename || "", false, nbd.packages);

    BlockCluster.addBlocks({
        [IDs[0]]: createBlock({
            opcode: BlockOpCode.ProceduresDefinition,
            inputs: {
                "custom_block": [
                    1,
                    IDs[1]
                ]
            },
            next: body.firstIndex,
            topLevel: true
        }),

        // Proto
        [IDs[1]]: createMutation({
            opcode: BlockOpCode.ProceduresPrototype,
            parent: IDs[0],
            shadow: true,
            inputs,
            mutation: {
                tagName: "mutation",
                children: [],
                proccode: (FunctionDeclaration as any).id.name + " " + "%s ".repeat(FunctionDeclaration.params.length).trimEnd(),
                argumentids: blockIds,
                argumentdefaults: "[" + '\"\",'.repeat(FunctionDeclaration.params.length).slice(0, -1) + "]",
                argumentnames: argNames,
                warp: startedWithTurbo && "true" || "false"
            }
        }),

        ...paramBlocks,
        ...body.blocks,
    })

    return { doNotParent: true }
})