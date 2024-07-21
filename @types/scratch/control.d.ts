/**
 * The `scratch:control` module provides blocks used in the "control"
 * section of Scratch.
 *
 * Example using the global `control`:
 *
 * ```js
 * control.wait(5);
 * // Yields the thread for 5 seconds.
 * ```
 */
declare module "control" {
    import control = require("scratch:control");
    export = control;
}
declare module "scratch:control" {
    global {
        interface control {
            /**
             * Yields the thread for the given amount of seconds.
             * This block is commonly known as the "`Wait`" block.
             *
             * @param {number} Time - The amount of seconds to yield the thread for.
             * @returns {void}
             * @description
             * This function yields the thread for the given amount of time.
             * The thread resumes after that timeframe has ended.
             * 
             * @example
             * // Wait for 5 seconds.
             * control.wait(5);
             * 
             * // Wait for 0.1 seconds.
             * control.wait(0.1);
             *
             * @since v0.0.1
             */
            wait(Time: number): void;

            /**
             * Yields the thread for the given amount of seconds.
             * This block is more accurate than the "`Wait`" block, precisely waiting the exact time given.
             * TurboMode does NOT affect this block.
             *
             * @param {number} Time - The amount of seconds to yield the thread for.
             * @returns {void}
             * @description
             * This function yields the thread for the given amount of time.
             * The thread resumes after that timeframe has ended.
             * 
             * @example
             * // Wait for 5 seconds.
             * control.heartbeat(5);
             * 
             * // Wait for 0.1 seconds.
             * control.heartbeat(0.1);
             *
             * @since v0.0.1
             */
            heartbeat(Time: number): void;

            /**
             * Yields the thread until the expression is met.
             * This block is commonly known as the "`Wait until`" block.
             *
             * @param {string} Expr - The expression, as a string.
             * @returns {void}
             * @description
             * This function yields the thread until the expression evaluates to "`true`".
             * The thread resumes after that timeframe has ended.
             * 
             * @example
             * // Wait until "x" is 1.
             * let x = 0;
             * control.waitUntil("x == 1");
             *
             * @since v0.0.1
             */
            waitUntil(Expr: string): void;

            /**
             * Stops the specified part of the project.
             *
             * @param {string} target - Specifies what to stop: "all", "this script", or "other scripts in sprite".
             * @returns {void}
             * @description
             * This function stops the specified part of the project.
             * 
             * @example
             * // Stop all scripts.
             * control.stop("all");
             * 
             * // Stop this script.
             * control.stop("this script");
             *
             * @since v0.0.1
             */
            stop(target: string): void;

            /**
             * Creates a clone of the specified sprite.
             *
             * @param {string} target - The sprite to clone: "myself" or another sprite name.
             * @returns {void}
             * @description
             * This function creates a clone of the specified sprite.
             * 
             * @example
             * // Clone the current sprite.
             * control.clone("myself");
             *
             * @since v0.0.1
             */
            clone(target: string): void;

            /**
             * Deletes the clone of the sprite that is currently running this script.
             *
             * @returns {void}
             * @description
             * This function deletes the clone of the sprite that is currently running this script.
             * 
             * @example
             * // Delete this clone.
             * control.deleteClone();
             *
             * @since v0.0.1
             */
            deleteClone(): void;
        }

        /**
         * The `scratch:control` module provides blocks used in the "control"
         * section of Scratch.
         *
         * Example using the global `control`:
         *
         * ```js
         * control.wait(5);
         * // Yields the thread for 5 seconds.
         * ```
         */
        var control: control;
    }
    export = globalThis.control;
}
