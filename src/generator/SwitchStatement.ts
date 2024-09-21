/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : SwitchStatement.ts
* Description       : Creates a switch statement
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

import { BlockCluster } from "../util/blocks";
import * as t from "@babel/types";
import { buildData } from "../util/types";

function switchToIfStatement(switchStmt: t.SwitchStatement): t.IfStatement | null {
    const { discriminant, cases, loc } = switchStmt;

    const buildCondition = (test: t.Expression | null) =>
        test ? t.binaryExpression('==', discriminant, test) : null;

    let ifStatement: any = null;
    let currentIfStatement: t.IfStatement | null = null;

    for (const switchCase of cases) {
        const caseLoc = switchCase.loc;

        let condition: t.Expression | null = null;
        for (const test of switchCase.test ? [switchCase.test] : []) {
            const newCondition: any = buildCondition(test);
            condition = condition ? t.logicalExpression('||', condition, newCondition) : newCondition;
        }

        const consequent = t.blockStatement(switchCase.consequent);
        const newIfStatement = t.ifStatement(condition!, consequent);
        newIfStatement.loc = caseLoc;

        if (currentIfStatement) {
            currentIfStatement.alternate = newIfStatement;
        } else {
            ifStatement = newIfStatement;
        }

        currentIfStatement = newIfStatement;
    }

    ifStatement.loc = loc;
    return ifStatement;
}

module.exports = ((BlockCluster: BlockCluster, SwitchStatement: t.SwitchStatement, buildData: buildData) => {
    return require('./IfStatement')(BlockCluster, switchToIfStatement(SwitchStatement), buildData);
})