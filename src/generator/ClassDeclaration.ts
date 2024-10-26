/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : ClassDeclaration.ts
* Description       : Creates a class
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 25/19/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { BlockCluster } from "../util/blocks";
import { ClassDeclaration, ClassMethod, functionDeclaration, identifier, Identifier, numericLiteral } from "@babel/types"
import { buildData } from "../util/types";
import { Error } from "../util/err";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

module.exports = ((BlockCluster: BlockCluster, ClassDeclaration: ClassDeclaration, buildData: buildData) => {
    let keysGenerated: string[] = [];
    let props: Identifier[] = [];
    let classMethods: ClassMethod[] = [];

    let className = ClassDeclaration.id.name as string;
    let classBody = ClassDeclaration.body;
    let classData = classBody.body;

    let jsonPath = join(__dirname, '../assets/classData.json');
    let classDataJson = JSON.parse(readFileSync(jsonPath).toString())
    classDataJson[className] = {
        ["params"]: [],
        ["paramnames"]: [],
        ["fn"]: [],
        ["instances"]: 0,
        ["hasc"]: false
    }

    if (ClassDeclaration.superClass) {
        let name = (ClassDeclaration.superClass as Identifier).name;
        classDataJson[className] = JSON.parse(JSON.stringify(classDataJson[name]));
        classDataJson[className].instances = 0;

        classDataJson[className].paramnames.forEach((v) => {
            props.push(identifier(v));
        });

        classDataJson[className].fn.forEach((v: ClassMethod) => {
            classMethods.push(v);
        });
    }

    let hasConstructor = false;
    classData.forEach((v, i) => {
        if (v.type == "ClassProperty") {
            classDataJson[className].params.push(v.value || numericLiteral(0));
            props.push(identifier((v.key as Identifier).name));
            classDataJson[className].paramnames.push((v.key as Identifier).name);
        } else if (v.type == "ClassMethod") {
            classMethods.push(v);

            if (v.kind == "constructor") {
                hasConstructor = true;
            }
        }
    })

    for (let i = 0; i < classMethods.length; i++) {
        let classMethod = classMethods[i];
        let body = classMethod.body;
        let name = classMethod.kind != "constructor" && (classMethod.key as Identifier).name || "new";
        let newProps = [...props];

        for (let i = 0; i < classMethod.params.length; i++) {
            newProps.push(classMethod.params[i] as Identifier)
        }

        let constructorFunction = functionDeclaration(identifier(`${className}.${name}`), newProps, body)
        require('./FunctionDeclaration')(BlockCluster, constructorFunction, buildData);

        if (classMethod.kind != "constructor") {
            classDataJson[className].fn.push(classMethod);
        }
    }

    classDataJson[className]["hasc"] = hasConstructor;
    
    writeFileSync(jsonPath, JSON.stringify(classDataJson));

    return { keysGenerated }
})