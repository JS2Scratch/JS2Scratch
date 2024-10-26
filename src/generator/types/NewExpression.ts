/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : StringLiteral.ts
* Description       : Creates a string
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { BlockCluster, createBlock, createMutation } from "../../util/blocks";
import { CallExpression, ClassMethod, Expression, Identifier, isVariableDeclaration, NewExpression, VariableDeclaration } from "@babel/types"
import { getBlockNumber, getScratchType, getSubstack, ScratchType } from "../../util/scratch-type"
import { includes, uuid } from "../../util/scratch-uuid";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { evaluate } from "../../util/evaluate";
import { BlockOpCode, buildData } from "../../util/types";
import { createFunction, createLibrary } from "../../util/lib-convert";
import { Error, FatalErr } from "../../util/err";

module.exports = ((BlockCluster: BlockCluster, VariableDeclaration: VariableDeclaration, NewExpression: NewExpression, buildData: buildData, varname: string) => {
    if (!isVariableDeclaration(VariableDeclaration)) {
        // TODO: Throw error
        FatalErr("Attempt to create a new expression without a variable!");
    }

    let repeatID = uuid(includes.scratch_alphanumeric, 16);
    let instanceID = uuid(includes.scratch_alphanumeric, 16);

    let classes = JSON.parse(readFileSync(join(__dirname, '../../assets/classData.json')).toString());
    let iden = (NewExpression.callee as Identifier);
    let plainName = iden.name;
    let className = `${plainName}.instances`
    let args: Expression[] = [];

    // TODO: Check if the class exists
    if (!classes[plainName]) {
        new Error("Reference found to non-existant class", buildData.originalSource, [ { line: iden.loc.start.line, column: iden.loc.start.column, length: iden.loc.end.column - iden.loc.start.column } ], VariableDeclaration.loc.filename).displayError();
    }

    BlockCluster.addBlocks({
        [repeatID]: createBlock({
            opcode: BlockOpCode.ControlRepeat,
            inputs: {
                "TIMES": getScratchType(ScratchType.number, 1),
                "SUBSTACK": getSubstack(instanceID)
            }
        }),
    });

    let params: Expression[] = classes[(NewExpression.callee as Identifier).name].params;
    let last = instanceID
    let datas: any = {
        [instanceID]: createBlock({
            opcode: BlockOpCode.DataAddToList,
            parent: repeatID,
            inputs: {
                "ITEM": getScratchType(ScratchType.number, varname)
            },

            fields: {
                "LIST": [
                    className,
                    className
                ]
            }
        })
    };

    params.forEach((v) => {
        let paramID = uuid(includes.scratch_alphanumeric, 16);
        let blockData = evaluate(v.type, BlockCluster, v, paramID, buildData).block;

        args.push(v)

        datas[last].next = paramID
        datas = {
            ...datas,
            [paramID]: createBlock({
                opcode: BlockOpCode.DataAddToList,
                parent: last,

                inputs: {
                    "ITEM": blockData
                },

                fields: {
                    "LIST": [
                        className,
                        className
                    ]
                }
            })
        };

        last = paramID
    });

    let oldArgs = [ ...args ];
    if (classes[(NewExpression.callee as Identifier).name]["hasc"]) {
        for (let i = 0; i < NewExpression.arguments.length; i++) {
            args.push(NewExpression.arguments[i] as Expression)
        }
    
        let ID = uuid(includes.scratch_alphanumeric, 16);
        let fnName = plainName + ".new";
        let inputs: { [key: string]: any } = {};
        let argumentids = "[";
        for (let i = 0; i < args.length; i++) {
            let code = fnName + "_" + i;
    
            if ((i + 1) <= params.length) {
                let base = uuid(includes.scratch_alphanumeric, 16);
                let add = uuid(includes.scratch_alphanumeric, 16);
                let top = uuid(includes.scratch_alphanumeric, 16);
    
                BlockCluster.addBlocks({
                    [base]: createBlock({
                        opcode: BlockOpCode.DataItemNumOfList,
                        parent: add,
                        inputs: {
                            "ITEM": getScratchType(ScratchType.number, varname)
                        },
                        fields: {
                            "LIST": [
                                className,
                                className,
                            ]
                        }
                    }),
    
                    [add]: createBlock({
                        opcode: BlockOpCode.OperatorAdd,
                        parent: top,
                        inputs: {
                            ["NUM1"]: getBlockNumber(base),
                            ["NUM2"]: getScratchType(ScratchType.number, i + 1)
                        }
                    }),
    
                    [top]: createBlock({
                        opcode: BlockOpCode.DataItemOfList,
                        inputs: {
                            "INDEX": getBlockNumber(add)
                        },
                        fields: {
                            "LIST": [
                                className,
                                className,
                            ]
                        }
                    })
                });
    
                inputs[code] = getBlockNumber(top);
            } else {
                let id = uuid(includes.scratch_alphanumeric, 16);
    
                inputs[code] = evaluate(
                    args[i].type,
                    BlockCluster,
                    args[i],
                    id,
                    buildData
                ).block;
            }
    
            let hasNext = (i + 1) <= (args.length - 1)
            argumentids += `"${code}"${hasNext && "," || ""}`;
        };
    
        argumentids += "]";
    
        datas[last].next = ID;
    
        BlockCluster.addBlocks({
            [ID]: createMutation({
                opcode: BlockOpCode.ProceduresCall,
                parent: last,
                inputs,
                mutation: {
                    tagName: "mutation",
                    children: [],
                    proccode: fnName + " " + "%s ".repeat(args.length).trimEnd(),
                    argumentids,
                    warp: "false",
                }
            })
        });
    }

    BlockCluster.addBlocks(datas);

    let fns: any = {};
    let allFns: ClassMethod[] = classes[(NewExpression.callee as Identifier).name].fn;
    allFns.forEach((v) => {
        fns[(v.key as Identifier).name] = createFunction({
            body: ((callExpression: CallExpression, blockCluster: any, parentId: string, buildData: buildData) => {
                let ID = uuid(includes.scratch_alphanumeric, 16);
                let fnName = plainName + "." + (v.key as Identifier).name;
                let inputs: { [key: string]: any } = {};
                let argumentids = "[";

                for (let i = 0; i < callExpression.arguments.length; i++) {
                    oldArgs.push(callExpression.arguments[i] as Expression);
                }

                for (let i = 0; i < oldArgs.length; i++) {
                    let code = fnName + "_" + i;

                    if ((i + 1) <= params.length) {
                        let base = uuid(includes.scratch_alphanumeric, 16);
                        let add = uuid(includes.scratch_alphanumeric, 16);
                        let top = uuid(includes.scratch_alphanumeric, 16);

                        BlockCluster.addBlocks({
                            [base]: createBlock({
                                opcode: BlockOpCode.DataItemNumOfList,
                                parent: add,
                                inputs: {
                                    "ITEM": getScratchType(ScratchType.number, varname)
                                },
                                fields: {
                                    "LIST": [
                                        className,
                                        className,
                                    ]
                                }
                            }),

                            [add]: createBlock({
                                opcode: BlockOpCode.OperatorAdd,
                                parent: top,
                                inputs: {
                                    ["NUM1"]: getBlockNumber(base),
                                    ["NUM2"]: getScratchType(ScratchType.number, i + 1)
                                }
                            }),

                            [top]: createBlock({
                                opcode: BlockOpCode.DataItemOfList,
                                inputs: {
                                    "INDEX": getBlockNumber(add)
                                },
                                fields: {
                                    "LIST": [
                                        className,
                                        className,
                                    ]
                                }
                            })
                        });

                        inputs[code] = getBlockNumber(top);
                    } else {
                        let id = uuid(includes.scratch_alphanumeric, 16);

                        inputs[code] = evaluate(
                            oldArgs[i].type,
                            BlockCluster,
                            oldArgs[i],
                            id,
                            buildData
                        ).block;

                    }

                    let hasNext = (i + 1) <= (oldArgs.length - 1)
                    argumentids += `"${code}"${hasNext && "," || ""}`;
                };

                argumentids += "]";                

                BlockCluster.addBlocks({
                    [parentId]: createMutation({
                        opcode: BlockOpCode.ProceduresCall,
                        parent: last,
                        inputs,
                        mutation: {
                            tagName: "mutation",
                            children: [],
                            proccode: fnName + " " + "%s ".repeat(oldArgs.length).trimEnd(),
                            argumentids,
                            warp: "false",
                        }
                    })
                });

                return //{ keysGenerated: [ parentId ] }
            })
        })
    })

    buildData.packages.libraries.blockLibraries.push(
        createLibrary(varname, fns)
    );

    classes[(NewExpression.callee as Identifier).name].instances += 1;
    writeFileSync(join(__dirname, '../../assets/classData.json'), JSON.stringify(classes))

    return {
        keysGenerated: [repeatID]
    }
})