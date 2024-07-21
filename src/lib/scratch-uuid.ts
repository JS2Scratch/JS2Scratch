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

// Scratch - Style UUIDs

export function uuid(Include: String, Length = 32) {
    let result = '';

    for (let i = 0; i < Length; i++) {
        const randomIndex = Math.floor(Math.random() * Include.length);
        result += Include.charAt(randomIndex);
    }

    return result;
}

export const includes = {
    scratch_alphanumeric: "0123456789abcdef",
    alphanumeric: "0123456789abcdefghijklmnopqrstuvwxyz",
    alphanumeric_with_symbols: "0123456789abcdefghijklmnopqrstuvwxyz`!£$%^&*()_+"
}