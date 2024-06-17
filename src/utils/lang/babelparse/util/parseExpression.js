const generateUUID = require('./genUUID');
const errors = require('./error');
const chalk = require('chalk');

const operatorMap = {
    '*': 'operator_multiply',
    '+': 'operator_add',
    '-': 'operator_subtract',
    '/': 'operator_divide',
    '<': 'operator_lt',
    '>': 'operator_gt',
    '==': 'operator_equals',
    '===': 'operator_equals',
    '!=': 'operator_not_equal',
    '!==': 'operator_not_equal',
    '!': 'operator_not',
    '&&': 'operator_and',
    '||': 'operator_or'
};

const parseExpression = (expr, parentIndex = null) => {
    if (!expr) {
        errors.throw(
            errors.enum.Null,
            errors.bug(
                `No expression was given to the expression handler.`
            ) + chalk.red(chalk.bold(`\n\nDebug Info: `)) + `Line: ${chalk.bold(chalk.blue(expr.loc.start.line))}\tColumn: ${chalk.bold(chalk.blue(expr.loc.start.column))}`
        )
    }

    if (expr.type === 'BinaryExpression' || expr.type === 'LogicalExpression') {
        let operatorBlockId = generateUUID(); // Generate UUID for operator block

        const leftOperand = parseExpression(expr.left, operatorBlockId);
        const rightOperand = parseExpression(expr.right, operatorBlockId);

        let operatorOpcode = operatorMap[expr.operator];

        if (!operatorOpcode) {
            errors.throw(
                errors.enum.Unsupported,
                errors.bug(
                    `Unsupported operator: "${expr.operator}".`
                ) + chalk.red(chalk.bold(`\n\nDebug Info: `)) + `Line: ${chalk.bold(chalk.blue(expr.loc.start.line))}\tColumn: ${chalk.bold(chalk.blue(expr.loc.start.column))}`
            );
        }

        // Handle logical operators: &&, ||, !
        if (expr.type === 'LogicalExpression') {
            operatorOpcode = operatorMap[expr.operator];
            operatorBlockId = generateUUID(); // Generate new UUID for logical block

            if (leftOperand.reference[0] !== 3 || rightOperand.reference[0] !== 3)
            {
                errors.throw(
                    errors.enum.InvalidArguments,
                    `Invalid Arguments (NOT a block, such as OR, NOT, or AND) were found in a logical expression. Scratch does not allow this (e.g 5 or 3)` + chalk.red(chalk.bold(`\n\nDebug Info: `)) + `Line: ${chalk.bold(chalk.blue(expr.loc.start.line))}\tColumn: ${chalk.bold(chalk.blue(expr.loc.start.column))}`
                );
            }

            const operatorBlock = {
                [operatorBlockId]: {
                    "opcode": operatorOpcode,
                    "next": null,
                    "do_not_change_next": true,
                    "parent": String(parentIndex),
                    "inputs": {
                        "OPERAND1": leftOperand.reference,
                        "OPERAND2": rightOperand.reference
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": !parentIndex
                }
            };

            return {
                blocks: {
                    ...leftOperand.blocks,
                    ...rightOperand.blocks,
                    ...operatorBlock
                },
                reference: [
                    3,
                    operatorBlockId,
                    [
                        4,
                        ""
                    ]
                ]
            };
        }

        // Handle binary operators: <, >, ==, ===, !=, !==
        if (expr.operator === '!=' || expr.operator === '!==') {
            // Map "!=" and "!==" to "not equal" (wrapped in a "not" block)
            operatorOpcode = 'operator_not';
            operatorBlockId = generateUUID(); // Generate new UUID for not block

            const equalOperatorBlockId = generateUUID(); // Generate UUID for equal operator block
            const equalOperatorBlock = {
                [equalOperatorBlockId]: {
                    "opcode": 'operator_equals',
                    "next": null,
                    "do_not_change_next": true,
                    "parent": String(operatorBlockId),
                    "inputs": {
                        "OPERAND1": leftOperand.reference,
                        "OPERAND2": rightOperand.reference
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            };

            const notBlock = {
                [operatorBlockId]: {
                    "opcode": operatorOpcode,
                    "next": null,
                    "do_not_change_next": true,
                    "parent": String(parentIndex),
                    "inputs": {
                        "OPERAND": [
                            2,
                            equalOperatorBlockId
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": !parentIndex
                }
            };

            return {
                blocks: {
                    ...leftOperand.blocks,
                    ...rightOperand.blocks,
                    ...equalOperatorBlock,
                    ...notBlock
                },
                reference: [
                    3,
                    operatorBlockId,
                    [
                        4,
                        ""
                    ]
                ]
            };
        } else {
            // Regular binary operators like <, >, ==, ===
            operatorBlockId = generateUUID(); // Generate new UUID for comparison block

            const operatorBlock = {
                [operatorBlockId]: {
                    "opcode": operatorOpcode,
                    "next": null,
                    "do_not_change_next": true,
                    "parent": String(parentIndex),
                    "inputs": {
                        "OPERAND1": leftOperand.reference,
                        "OPERAND2": rightOperand.reference
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": !parentIndex
                }
            };

            return {
                blocks: {
                    ...leftOperand.blocks,
                    ...rightOperand.blocks,
                    ...operatorBlock
                },
                reference: [
                    3,
                    operatorBlockId,
                    [
                        4,
                        ""
                    ]
                ]
            };
        }
    } else if (expr.type === 'CallExpression') {
        if (expr.callee.type === 'MemberExpression' &&
            expr.callee.object.name === 'operation' &&
            expr.callee.property.name === 'join') {

            const joinBlockId = generateUUID();
            const leftOperand = parseExpression(expr.arguments[0], joinBlockId);
            const rightOperand = parseExpression(expr.arguments[1], joinBlockId);

            const joinBlock = {
                [joinBlockId]: {
                    "opcode": "operator_join",
                    "next": null,
                    "do_not_change_next": true,
                    "parent": String(parentIndex),
                    "inputs": {
                        "STRING1": leftOperand.reference,
                        "STRING2": rightOperand.reference
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": !parentIndex
                }
            };

            return {
                blocks: {
                    ...leftOperand.blocks,
                    ...rightOperand.blocks,
                    ...joinBlock
                },
                reference: [
                    3,
                    joinBlockId,
                    [
                        4,
                        ""
                    ]
                ]
            };
        } else {
            errors.throw(
                errors.enum.Unsupported,
                errors.bug(
                    `Unsupported CallExpression: "${expr.callee.object.name}.${expr.callee.property.name}".`
                ) + chalk.red(chalk.bold(`\n\nDebug Info: `)) + `Line: ${chalk.bold(chalk.blue(expr.loc.start.line))}\tColumn: ${chalk.bold(chalk.blue(expr.loc.start.column))}`
            );
        }
    } else if (expr.type === 'StringLiteral') {
        return {
            reference: [
                1,
                [
                    10,
                    expr.value
                ]
            ]
        };
    } else if (expr.type === "Identifier") {
        let motionOpcode;
        if (expr.name === "X") {
            motionOpcode = "motion_xposition";
        } else if (expr.name === "Y") {
            motionOpcode = "motion_yposition";
        } else if (expr.name === "Direction") {
            motionOpcode = "motion_direction";
        }

        if (motionOpcode) {
            const motionBlockId = generateUUID();
            const motionBlock = {
                [motionBlockId]: {
                    "opcode": motionOpcode,
                    "next": null,
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": !parentIndex
                }
            };

            return {
                blocks: {
                    ...motionBlock
                },
                reference: [
                    3,
                    motionBlockId,
                    [
                        4,
                        ""
                    ]
                ]
            };
        } else {
            return {
                reference: [
                    1,
                    [
                        12,
                        expr.name,
                        expr.name
                    ]
                ]
            };
        }
    } else if (expr.type === 'NumericLiteral') {
        return {
            reference: [
                1,
                [
                    4,
                    String(expr.value)
                ]
            ]
        };
    } else {
        errors.throw(
            errors.enum.Unsupported,
            errors.bug(
                `Unable to parse expression of type, "${expr.type}".`
            ) + chalk.red(chalk.bold(`\n\nDebug Info: `)) + `Line: ${chalk.bold(chalk.blue(expr.loc.start.line))}\tColumn: ${chalk.bold(chalk.blue(expr.loc.start.column))}`
        );
    }
};

module.exports = parseExpression;