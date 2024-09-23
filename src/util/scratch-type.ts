/*******************************************************************
* Copyright         : 2024 saaawdust
* File Name         : scratch-type.ts
* Description       : Scratch-type util
*                    
* Revision History  :
* Date		Author 			Comments
* ------------------------------------------------------------------
* 14/09/2024	saaawdust	Initial Creation
*
/******************************************************************/

export enum ScratchType {
    number = 4,
    positive_number = 5,
    positive_int = 6,
    int = 7,
    angle = 8,
    color = 9,
    string = 10,
    broadcast = 11,
    variable = 12,
    list = 13
}

type ScratchInput = [number, ([ScratchType, any, string?, string?] | string)?, [ScratchType, any]?];

function getSubstack(startIndex: string): ScratchInput {
    return [
        2,
        startIndex
    ]
}

function getScratchType(Type: ScratchType, Value: any): ScratchInput {
    return [
        1,
        [
            Type,
            Value
        ]
    ]
}

function getColor(Type: ScratchType, Value: any, Hex: string): ScratchInput {
    return [
        1,
        [
            Type,
            Value,
            Hex
        ]
    ]
}

function getVariable(Variable: string): ScratchInput {
    return [
        3,
        [
            12,
            Variable,
            Variable
        ],
        [
            4,
            ""
        ]
    ]
}

function getBlockNumber(BlockID: string): ScratchInput {
    return [
       3,
       BlockID,
       [
            4,
            ""
       ]
    ]
}

function getBroadcast(Broadcast: string): ScratchInput {
    return [
        1,
        [
            11,
            Broadcast,
            Broadcast
        ]
    ]
}

function getMenu(Menu: string): ScratchInput {
    return [
        1,
        Menu
    ]
}

export { getScratchType, getColor, getVariable, getBlockNumber, getMenu, getBroadcast, getSubstack }