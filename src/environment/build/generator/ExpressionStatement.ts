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
 * Evaluates an expression statement.
 */

import { join } from 'path';
import { existsSync } from 'fs';
import { GenerationParams } from '../types/Generation';

// There are lots of expression statements.
module.exports = ((Parameters: GenerationParams, OriginalSource: string) => {
    let ExpressionStatement = Parameters.ast[Parameters.index];

    const expressionFolder = join(__dirname, 'ExpressionStatementSub');
    const file = join(expressionFolder, ExpressionStatement.expression.type + ".ts");
    let exported;

    if (existsSync(file)) {
        let requiredFile = require(file);
        exported = requiredFile(ExpressionStatement, OriginalSource, Parameters.key);
    }

    return exported;
})