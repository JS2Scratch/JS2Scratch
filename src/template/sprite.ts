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

import { copyFileSync, renameSync } from "fs";
import { Sprite, Costume, Sound } from "../class/Sprite";
import { join, parse } from "path";
import { includes, uuid } from '../lib/scratch-uuid';

export function createCostume({
    name = "default",
    path = "",
    bitmapResolution = 2,
    rotationCenterX = 0,
    rotationCenterY = 0,
} = {}): Costume {

    let newCostume: Costume = {
        name: name,
        bitmapResolution: bitmapResolution,
        dataFormat: "svg",
        assetId: "null",
        md5ext: "null",
        rotationCenterX: rotationCenterX,
        rotationCenterY: rotationCenterY,
    }

    const { ext, base } = parse(path);
    const newFilePath = join(__dirname, '../tmp', base);

    copyFileSync(path, newFilePath);

    const uuidName = uuid(includes.scratch_alphanumeric);
    const uuidFullName = `${uuidName}${ext}`;
    const newFilePathWithUUID = join(__dirname, '../tmp', uuidFullName);

    renameSync(newFilePath, newFilePathWithUUID);

    newCostume.assetId = uuidName;
    newCostume.md5ext = uuidFullName;
    newCostume.dataFormat = ext.slice(1); // Remove the leading dot

    return newCostume;
}

export function createSound({
    name = "default",
    path = "",
} = {}): Sound {

    let newSound: Sound = {
        name: name,
        dataFormat: "mp3",
        assetId: "null",
        md5ext: "null",
    }

    const { ext, base } = parse(path);
    const newFilePath = join(__dirname, '../tmp', base);

    copyFileSync(path, newFilePath);

    const uuidName = uuid(includes.scratch_alphanumeric);
    const uuidFullName = `${uuidName}${ext}`;
    const newFilePathWithUUID = join(__dirname, '../tmp', uuidFullName);

    renameSync(newFilePath, newFilePathWithUUID);

    newSound.assetId = uuidName;
    newSound.md5ext = uuidFullName;
    newSound.dataFormat = ext.slice(1); // Remove the leading dot

    return newSound;
}

export function createSprite({
    isStage = false,
    name = "default",
    variables = {},
    lists = {}, 
    broadcasts = {}, // TODO: Implement Broadcasts
    blocks = {},
    comments = {}, // TODO: Implement Comments
    currentCostume = 0,
    costumes = [],
    sounds = [], 
    volume = 100,
    x = 0,
    y = 0,
    size = 100,
    direction = 90,
    draggable = false,
    rotationStyle = "all around"
}: Partial<Sprite> = {}) {

    if (costumes.length === 0) {
        if (isStage) {
            costumes.push(createCostume({
                path: join(__dirname, "svg", "background.svg")
            }));
        } else {
            costumes.push(createCostume({ 
                path: join(__dirname, "svg", "default.svg")
            }));
        }
    }

    if (isStage) name = "Stage";

    return {
        isStage: isStage,
        name: name,
        variables: variables,
        lists: lists,
        broadcasts: broadcasts,
        blocks: blocks,
        comments: comments,
        currentCostume: currentCostume,
        costumes: costumes,
        sounds: sounds,
        volume: volume,
        x: x,
        y: y,
        size: size,
        direction: direction,
        draggable: draggable,
        rotationStyle: rotationStyle,
    };
}
