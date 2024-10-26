/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : VariableDeclaration.ts
* Description       : Creates a VariableDeclaration (Set variable to X)
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { BlockCluster, createBlock } from "../util/blocks";
import { VariableDeclaration } from "@babel/types"
import { Block, BlockOpCode, buildData, typeData } from "../util/types";
import { getScratchType, ScratchType } from "../util/scratch-type";
import { uuid, includes } from "../util/scratch-uuid"
import { evaluate } from "../util/evaluate";
import { join } from "path";
import { readFileSync, writeFileSync } from "fs";

module.exports = ((BlockCluster: BlockCluster, VariableDeclaration: VariableDeclaration, buildData: buildData) => {

    let keysGenerated: string[] = [];
    let blocks: {[key: string]: Block} = {};
    for (let i = 0; i < VariableDeclaration.declarations.length; i++) {
        let declarations = VariableDeclaration.declarations[i];
        let variableName = (declarations as any).id.name;

        let global = false;
        let local = false;
        let cloud = false;
        if (variableName.startsWith("_g_")) {
            global = true;
            variableName = variableName.slice(3);
            variableName = variableName.slice(3);
        } else if (variableName.startsWith("_c_")) { 
            cloud = true;
            global = true;
            variableName = variableName.slice(3);
        } else if (variableName.startsWith("_l_")) {
            local = true;
            variableName = variableName.slice(3);
        } else {
            global = true
        }

        if (local) {
            let jsonFile = join(__dirname, "../assets/variables.json");
            let content = JSON.parse(readFileSync(jsonFile).toString()) as any[];
            content.push(variableName);

            writeFileSync(jsonFile, JSON.stringify(content));
        }

        if (declarations.init != null && declarations.init.type == "NewExpression") {
            return require('./types/NewExpression')(BlockCluster, VariableDeclaration, declarations.init, buildData, variableName)
        }

        let id = uuid(includes.scratch_alphanumeric, 16);
        let value: typeData | any = (declarations.init != null && declarations.init != undefined)
            ? evaluate(declarations.init.type, BlockCluster, declarations.init, id, buildData)
            : { block: getScratchType(ScratchType.number, 0) };

        blocks[id] = createBlock(
            {
                opcode: BlockOpCode.DataSetVariableTo,
                inputs: {
                    "VALUE": value.block
                },
                fields: {
                    "VARIABLE": [
                        variableName,
                        variableName
                    ]
                }
            }
        );
       

        keysGenerated.push(id);
    }

    // Skip the last one
    for (let i = 0; i < keysGenerated.length - 1; i++)
    {
        let block = blocks[keysGenerated[i]];
        let nextBlock = blocks[keysGenerated[i + 1]];

        if (nextBlock)
        {
            block.next = keysGenerated[i + 1];
            nextBlock.parent = keysGenerated[i];
        }
    }

    BlockCluster.addBlocks(blocks);

    return { keysGenerated }
})