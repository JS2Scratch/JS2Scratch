const { createCostume } = require('./costume')
const { createFile, createDir } = require('../fs/create')
const { string } = require('../rand')
const transpiler = require('../lang/transpile')

const default_costume = require('./sprite_internal/default_costume')
const empty_costume = require('./sprite_internal/empty')

const path = require('path')
const fs = require('fs')

module.exports = {
    createSprite: (PROJECT_PATH, PROJECT_FOLDER, name = "Sprite1", isStage = false, x = 0, y = 0, costumes = [], sounds = [], visible = true, size = 100, direction = 90, draggable = true, blocks = {}) => {

        let newCostumes = []

        if (costumes.length <= 0) {
            let strName = string(32)

            if (!isStage) {
                createFile(PROJECT_FOLDER, strName + ".svg", default_costume)
            } else {
                createFile(PROJECT_FOLDER, strName + ".svg", empty_costume)
            }

            newCostumes.push(createCostume("Costume1", 2, `${strName}.svg`, 0, 0, "svg"))
        } else {
            for (let i = 0; i < costumes.length; i++) {
                let obj = costumes[i]

                if (obj.path == undefined) continue

                let img = obj.path
                let type = obj.type
                let name = obj.name

                let images = path.join(PROJECT_PATH, "images")
                let image = path.join(images, img)

                let rndName = string(32)
                fs.copyFileSync(image, path.join(PROJECT_FOLDER, rndName + `.${obj.type}`))

                newCostumes.push(createCostume(name || "costume", 2, rndName + `.${obj.type}`, 0, 0, type))
            }
        }

        const files = fs.readdirSync(PROJECT_PATH, { recursive: false });

        let variables = {}

        files.forEach((file) => {
            const filePath = path.join(PROJECT_PATH, file);
            const stats = fs.statSync(filePath);

            let type = "";
    
            if (isStage) type = "stage";
            else type = "sprite";

            if (stats.isFile()) {
                if (path.basename(filePath) === `${name}.${type}.js`) {
                    let transpiledCode = transpiler(fs.readFileSync(filePath).toString(), file)
                    blocks = transpiledCode[0]
                    variables = transpiledCode[1]
                }
            } else if (stats.isDirectory() && path.basename(filePath) === `${name}.${type}`)
            {
               let spriteData = fs.readdirSync(filePath)
               spriteData.forEach((inner_file) => {
                    let InnerfilePath = path.join(PROJECT_PATH, `${name}.${type}`, inner_file);
                    let transpiledCode = transpiler(fs.readFileSync(InnerfilePath).toString(), file)

                    const blocksLength = Object.keys(blocks).length;

                    for (let key in transpiledCode[0]) {
                        if (typeof key === 'string' && !isNaN(key)) {
                            const newKey = parseInt(key) + blocksLength;
                    
                            transpiledCode[0][newKey] = transpiledCode[0][key];
                    
                            if (transpiledCode[0][newKey].parent !== null) {
                                transpiledCode[0][newKey].parent = String(parseInt(transpiledCode[0][newKey].parent) + blocksLength);
                            }
                    
                            if (transpiledCode[0][newKey].next !== null) {
                                transpiledCode[0][newKey].next = String(parseInt(transpiledCode[0][newKey].next) + blocksLength);
                            }
                    
                            if (key !== newKey.toString()) {
                                delete transpiledCode[0][key];
                            }
                        }
                    }

                    blocks = Object.assign(blocks,  transpiledCode[0])
                    variables = Object.assign(variables,  transpiledCode[1])
               })
            }
        });

        return {
            "isStage": isStage,
            "name": name,
            "objName": name,
            "variables": variables,
            "lists": {},
            "broadcasts": {},
            "blocks": blocks,
            "comments": {},
            "currentCostume": 0,
            "costumes": newCostumes,
            "sounds": sounds,
            "volume": 100,
            "layerOrder": 0,
            "visible": visible,
            "x": x,
            "y": y,
            "size": size,
            "direction": direction,
            "draggable": draggable
        };
    }
};