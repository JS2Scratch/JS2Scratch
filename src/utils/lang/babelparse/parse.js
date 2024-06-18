// ShadowX

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const { join } = require('path')
const { existsSync } = require('fs');
const error = require('./util/error');

const allowedModes = [
    "strict"
]

module.exports = ((input, filename, preParsed = false) => {

    let ast = input

    if (!preParsed) {
        ast = parser.parse(input, {
            sourceType: 'module',
            plugins: ['jsx'],
        });
    }

    let code = {}
    let variables = {}
    let lists = {}
    let broadcast = {}

    let modes = [] // Modes can be set for different scopes

    let index = 0
    let skip = 0
    let lastIndexable = null

    const declaredVariables = new Set();
    const usedVariables = new Set();

    const convertToScratch = (path, node) => {

        if (skip <= 0) {
            if (!preParsed) console.log(node.type)
            let isLastNode = index + 1 === ast.program.body.length - 1;
            let filePath = join(__dirname, "gen", node.type + ".js")

            if (existsSync(filePath)) {
                let module = require(filePath)(node, index, isLastNode, ast, filename)

                if (module.Code) {
                    let key
                    if (lastIndexable && !lastIndexable.do_not_change_next) {
                        lastIndexable.next = String(index)
                        key = Object.keys(code).find(key => code[key] === lastIndexable);
                    }

                    if (module.Code && lastIndexable) {
                        module.Code.parent = key
                    }

                    // Merge additional code generated for expressions
                    if (module.AdditionalCode) {
                        Object.assign(code, module.AdditionalCode);
                    }

                    code[String(index)] = module.Code || {}
                    if (!module.Code.do_not_change_next) lastIndexable = code[String(index)]
                }

                let vars = module.Variables

                if (vars) {
                    Object.assign(variables, module.Variables)
                }

                skip = module.Skip
            }
        } else {
            skip--
        }

        index++
    };

    let comments = ast.comments || []
    // Used for "strict mode", etc
    for (let i = 0; i < comments.length; i++) {
        let object = comments[i]
        let value = object.value
        if (value.startsWith("!")) {
            let commentName = value.split("!")[1].toLowerCase().trim()
            if (!allowedModes.includes(commentName)) {
                console.warn(
                    error.warn(
                        `${filename}: Could not find comment directive, '${commentName}'. This will be ignored.`
                    )
                )
            } else {
                if (!modes.includes(commentName)) modes.push(commentName)
            }
        }
    }



    traverse(ast, {
        enter(path) {
            convertToScratch(path, path.node);
        },

        VariableDeclarator(path) {
            declaredVariables.add(path.node.id.name);
        },

        Identifier(path) {
            if (!path.findParent(p => p.isVariableDeclarator())) {
                usedVariables.add(path.node.name);
            }
        }
    });

    const unusedVariables = [...declaredVariables].filter(varName => !usedVariables.has(varName));

    let directiveFunctions = {
        "strict": (() => {
            for (let i = 0; i < unusedVariables.length; i++)
            {
                console.warn(
                    error.warn(
                        `${filename}: Unused variable, '${unusedVariables[i]}'.`
                    )
                )
            }
        })
    }

    for (let i = 0; i < modes.length; i++)
    {
        directiveFunctions[modes[i]]()
    }

    return [code, variables, index]
})