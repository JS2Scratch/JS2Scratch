/**
 * The `scratch:math` module provides blocks used in the "math" section of Scratch.
 *
 * Example using the global `math`:
 *
 * ```js
 * math.random(1, 10);
 * // Generates a random number between 1 and 10.
 * ```
 */
declare module "math" {
    import math = require("scratch:math");
    export = math;
}
declare module "scratch:math" {
    global {
        interface math {
            /**
             * Generates a random number between two specified values.
             *
             * @param {number} from - The lower bound.
             * @param {number} to - The upper bound.
             * @returns {number} A random number between the specified values.
             * @description
             * This function generates a random number between the specified lower and upper bounds.
             *
             * @example
             * // Generate a random number between 1 and 10.
             * math.random(1, 10);
             *
             * @since v0.0.1
             */
            random(from: number, to: number): number;

            /**
             * Calculates the remainder of a division operation.
             *
             * @param {number} dividend - The number to be divided.
             * @param {number} divisor - The number to divide by.
             * @returns {number} The remainder of the division.
             * @description
             * This function calculates the remainder of dividing the dividend by the divisor.
             *
             * @example
             * // Calculate 10 modulo 3.
             * math.mod(10, 3);
             *
             * @since v0.0.1
             */
            mod(dividend: number, divisor: number): number;

            /**
             * Rounds a number to the nearest integer.
             *
             * @param {number} num - The number to round.
             * @returns {number} The rounded number.
             * @description
             * This function rounds the specified number to the nearest integer.
             *
             * @example
             * // Round the number 4.7.
             * math.round(4.7);
             *
             * @since v0.0.1
             */
            round(num: number): number;

            /**
             * Performs a mathematical operation on a number.
             *
             * @param {string} operator - The operator to use.
             * @param {number} num - The number to operate on.
             * @returns {number} The result of the operation.
             * @description
             * This function performs the specified mathematical operation on the given number.
             *
             * @example
             * // Calculate the square root of 16.
             * math.operation("sqrt", 16);
             *
             * @since v0.0.1
             */
            operation(operator: string, num: number): number;

            /**
             * Gets the value of pi (π).
             *
             * @returns {number} The value of pi.
             * @description
             * This function returns the value of pi (π).
             *
             * @example
             * // Get the value of pi.
             * math.pi();
             *
             * @since v0.0.1
             */
            pi(): number;

            /**
             * Raises a number to a specified power.
             *
             * @param {number} base - The base number.
             * @param {number} exponent - The exponent to raise the base to.
             * @returns {number} The result of the exponentiation.
             * @description
             * This function raises the base number to the specified exponent.
             *
             * @example
             * // Calculate 2 raised to the power of 3.
             * math.pow(2, 3);
             *
             * @since v0.0.1
             */
            pow(base: number, exponent: number): number;
        }

        /**
         * The `scratch:math` module provides blocks used in the "math" section of Scratch.
         *
         * Example using the global `math`:
         *
         * ```js
         * math.random(1, 10);
         * // Generates a random number between 1 and 10.
         * ```
         */
        var math: math;
    }
    export = globalThis.math;
}
