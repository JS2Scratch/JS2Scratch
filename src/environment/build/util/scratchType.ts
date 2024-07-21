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
 * Creates a scratch type.
 */

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

type ScratchInput = [number, [ScratchType, any, string?, string?]?, [ScratchType, any]?];

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

function getVariable(Type: ScratchType, Variable: string): ScratchInput {
    return [
        3,
        [
            Type,
            Variable,
            Variable
        ],
        [
            4,
            ""
        ]
    ]
}

function getBlockNumber(BlockID: string) {
    return [
       3,
       BlockID,
       [
            4,
            ""
       ]
    ]
}

function getBroadcast(Broadcast: string) {
    return [
        1,
        [
            11,
            Broadcast,
            Broadcast
        ]
    ]
}

function getMenu(Menu: string) {
    return [
        1,
        Menu
    ]
}

export { getScratchType, getColor, getVariable, getBlockNumber, getMenu, getBroadcast }