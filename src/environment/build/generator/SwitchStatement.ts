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
 * Once again, we have no way
 * to represent a switch statement -
 * we cannot create a jump table, so
 * we'll have to transform the switch
 * statement into an IF.
 */

import { BlockOpCode } from "../../../class/Sprite";
import { createBlock } from "../../../template/block";
import { GenerationParams, NodeResult } from "../types/Generation";
import { evaluate } from "../util/evaluateValue";
import { parseSubstack } from '../util/parseSubstack';
import { errorMessages, warn } from "../../../lib/console";
import { SwitchCase } from "@babel/types"
import * as babel from "@babel/parser";

let ifStatement = require('./IfStatement');

// Converts a switch to an if
function constructIf(switchMain: any, cases: any, fileName: string, OriginalSource: string) {
    let ifStatements: any[] = []
    let conjoined: any = []

    for (let i = 0; i < cases.length; i++) {
        let chosenCase = cases[i];

        let binExpr: any = {
            type: "BinaryExpression",
            operator: "==",
            left: switchMain.discriminant,
            right: chosenCase.test,
            loc: switchMain.loc
        };

        if (chosenCase.consequent.length == 0 && chosenCase.test) {
            conjoined.push(chosenCase.test)
            continue;
        } else {
            let test = chosenCase.test;

            if (test && conjoined.length > 0) {

                warn(`file: ${fileName} line: ${chosenCase.loc.start.line} column: ${chosenCase.loc.start.column}: Chaining more than 1 cases in a switch may cause instability and cause your code not compile. In this case, please recompile your code again.`)

                let joinedSrc = `${switchMain.discriminant.name} == ` + OriginalSource.substring(test && test.start || 0, test && test.end || 0);  
                let arr: string[] = [];
                
                for (let i = 0; i < conjoined.length; i++) {
                    let object = conjoined[i];
                    arr.push(OriginalSource.substring(object.start, object.end));
                }

                for (let v = 0; v < arr.length; v++) {
                    arr[v] = `${switchMain.discriminant.name} == ${arr[v]}`
                }
                let fullStr = joinedSrc + "||" + arr.join("||");
                binExpr = babel.parseExpression(fullStr );
            }

            conjoined = [];
        };

        let newIf = {
            type: "IfStatement",
            loc: {
                filename: fileName
            },
            test: binExpr,
            consequent: {
                type: "BlockStatement",
                start: (chosenCase.consequent[0].start || 0) -1,
                end: chosenCase.consequent[chosenCase.consequent.length - 1].end || 0,
                body: chosenCase.consequent
            }
        }

        ifStatements.push(newIf)
    }

    let result = ifStatements[ifStatements.length - 1];

    for (let i = ifStatements.length - 2; i >= 0; i--) {
        
      result = {
        ...ifStatements[i],
        alternate: {
            body: [ result ],
            start: result.consequent.start,
            end: result.consequent.end,
        }
      };
    }
  
    return result;
}

// JS Syntax required
module.exports = ((Parameters: GenerationParams, OriginalSource: string) => {
    const specificNode = Parameters.ast[Parameters.index];
    let fileName = specificNode.loc.filename;

    let discriminant = specificNode.discriminant
    let cases = specificNode.cases;

    if (discriminant.type != "Identifier") {
        errorMessages["Switch statement must switch a variable"](`file: ${fileName} line: ${discriminant.loc.start.line} column: ${discriminant.loc.start.column}`)
    }

    // Transform switch into if.
    let newIfStatement = constructIf(specificNode, cases, fileName, OriginalSource);
    let newParams = {
        index: 0,
        ast: [ newIfStatement ], 
        key: Parameters.key,
        blocks: Parameters.blocks
        
    }

    return ifStatement(newParams, OriginalSource);
})