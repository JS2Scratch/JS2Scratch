#!/usr/bin/env node

/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : index.js
* Description       : Init for JS2Scratch
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 13/09/2024	saaawdust	Created file, setup environment
*
/******************************************************************/

const { join } = require('path');
const { register } = require('ts-node');

function init(filePath)
{
    register({ project: join(__dirname, "tsconfig.json"), transpileOnly: true });
    const result = require(filePath);
    return result.default || result;
}

init('./boot.ts');