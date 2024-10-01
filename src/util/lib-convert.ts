/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : fs.ts
* Description       : Library used for runtime-packages
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 22/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { Block, CallExpression } from "@babel/types";
import { BlockCluster } from "./blocks";
import { Error } from "./err";
import { evaluate } from "./evaluate";
import { buildData, typeData, BlockOpCode } from "./types";
import { createBlock } from "./blocks";

export interface BlockClustering {
    blocks: { any: Block };

    addBlocks(blocks: any): void;
}

export { BlockOpCode, buildData, typeData, Block  }



export function createFunction<t = void>(
    data: {
        parseArguments?: boolean,
        minimumArguments?: number,
        maximumArguments?: number,
        argTypes?: string[],
        body: (
            callExpression: CallExpression,
            blockCluster: BlockClustering,
            parentId: string,
            buildData: buildData,
            parsedArguments?: typeData[],
        ) => t
    },
): any {
    data.minimumArguments = data.minimumArguments || 0;
    data.maximumArguments = data.maximumArguments || Number.MAX_SAFE_INTEGER;
    data.argTypes = data.argTypes || [];
    data.parseArguments = data.parseArguments || false;

    return ((callExpression: CallExpression, blockCluster: BlockClustering, parentID: string, buildData: buildData) => {
        if (callExpression.arguments.length < (data as any).minimumArguments) {
            new Error(
                "Not enough arguments", 
                buildData.originalSource.substring(callExpression.loc?.start.index || 0, callExpression.loc?.end.index || 0), 
                [{ line: callExpression.loc?.start.line || 1, column: callExpression.loc?.start.column || 1, length: (callExpression.loc?.end.column || 1) - (callExpression.loc?.start.column || 1) }], 
                callExpression.loc?.filename || ""
            );
        }

        if (callExpression.arguments.length > (data as any).maximumArguments) {
            new Error(
                "Too many arguments", 
                buildData.originalSource.substring(callExpression.loc?.start.index || 0, callExpression.loc?.end.index || 0), 
                [{ line: callExpression.loc?.start.line || 1, column: callExpression.loc?.start.column || 1, length: (callExpression.loc?.end.column || 1) - (callExpression.loc?.start.column || 1) }], 
                callExpression.loc?.filename || ""
            );
        }

        let args: typeData[] = [];

        for (let i = 0; i < callExpression.arguments.length; i++) {
            let type = callExpression.arguments[i].type;
            if ((data.argTypes && data.argTypes[i] && data.argTypes[i] == type) || !data.argTypes || data.argTypes && !data.argTypes[i]) {
                if (!data.parseArguments) continue;

                args.push(
                    evaluate(type, blockCluster as any, callExpression.arguments[i], parentID, buildData)
                );
            } else if (data.argTypes && data.argTypes[i] && data.argTypes[i] != type) {
                new Error(
                    `Expected '${data.argTypes[i]}' for argument '${i + 1}', got: '${type}'`, 
                    buildData.originalSource.substring(callExpression.loc?.start.index || 0, callExpression.loc?.end.index || 0), 
                    [{ line: callExpression.loc?.start.line || 1, column: callExpression.loc?.start.column || 1, length: (callExpression.loc?.end.column || 1) - (callExpression.loc?.start.column || 1) }],
                    callExpression.loc?.filename || ""
                );
            }
        }

        return data.body(callExpression, blockCluster, parentID, buildData, args);
    });
}

export const createValueFunction = createFunction; // Internally, they're the same. It's just the typings, which don't apply here!

export function createLibrary(name: string, functions: any) {
    return {
        name,
        functions
    };
}

export function createGlobal(name: string, functions: any) {
    return {
        name,
        functions
    };
}

export function createImplementation(name: string, body: any) {
    return {
        name,
        body
    };
}


export { createBlock }