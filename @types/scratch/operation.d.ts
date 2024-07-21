/**
 * The `scratch:operation` module provides blocks used in the "operation"
 * section of Scratch.
 *
 * Example using the global `operation`:
 *
 * ```js
 * let x = operation.join("Hello, ", Username, ".");
 * // "Hello, Player."
 * ```
 */
declare module "operation" {
    import operation = require("scratch:operation");
    export = operation;
}
declare module "scratch:operation" {
    global {
        interface operation {
            /**
             * Joins all the given values together.
             * This block is commonly known as the "`join`" block.
             *
             * @param {...any} - Items to join
             * @returns {void}
             * @description
             * This function joins all the values given into a string.
             * 
             * @example
             * // "Hello, Player."
             * let x = operation.join("Hello, ", Username, ".");
             * 
             *
             * @since v0.0.1
             */
            join(...any: any[]): void;

            /**
             * Gets the letter at a specified position in a string.
             *
             * @param {number} index - The position of the letter.
             * @param {string} str - The string to get the letter from.
             * @returns {string} The letter at the specified position.
             * @description
             * This function returns the letter at the specified position in the given string.
             *
             * @example
             * // Get the first letter of the string "Hello".
             * let letter = operation.getLetterOfString(1, "Hello");
             *
             * @since v0.0.1
             */
            getLetterOfString(index: number, str: string): string;

            /**
             * Gets the length of a string.
             *
             * @param {string} str - The string to get the length of.
             * @returns {number} The length of the string.
             * @description
             * This function returns the length of the specified string.
             *
             * @example
             * // Get the length of the string "Hello".
             * let length = operation.getLengthOfString("Hello");
             *
             * @since v0.0.1
             */
            getLengthOfString(str: string): number;

            /**
             * Checks if a string contains a specified substring.
             *
             * @param {string} substring - The substring to check for.
             * @param {string} str - The string to check within.
             * @returns {boolean} True if the substring is found, otherwise false.
             * @description
             * This function checks if the specified substring is present within the given string.
             *
             * @example
             * // Check if the string "Hello, world!" contains "world".
             * let contains = operation.stringContains("world", "Hello, world!");
             *
             * @since v0.0.1
             */
            stringContains(substring: string, str: string): boolean;
        }

        /**
         * The `scratch:operation` module provides blocks used in the "operation"
         * section of Scratch.
         *
         * Example using the global `operation`:
         *
         * ```js
         * let x = operation.join("Hello, ", Username, ".");
         * // "Hello, Player."
         * ```
         */
        var operation: operation;
    }
    export = globalThis.operation;
}
