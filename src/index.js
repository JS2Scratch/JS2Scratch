/**
 * ShadowX
 * 
 * Part of the "JS2Scratch" Project
 * 
 * [2024]
 * [ Made with love <3 ]
 *
 * @lisence MIT
 */

const { register } = require('ts-node');

function init(filePath)
{
    register();
    const result = require(filePath);
    return result.default || result;
}

init('./boot.ts');