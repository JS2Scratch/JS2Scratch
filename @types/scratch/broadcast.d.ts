/**
 * The `scratch:broadcast` module provides blocks used in the "broadcast"
 * section of Scratch.
 *
 * Example using the global `broadcast`:
 *
 * ```js
 * broadcast.fire("message1");
 * // Broadcasts the message "message1".
 * ```
 */
declare module "broadcast" {
    import broadcast = require("scratch:broadcast");
    export = broadcast;
}
declare module "scratch:broadcast" {
    global {
        interface broadcast {
            /**
             * Broadcasts a message to all sprites without waiting for the scripts to complete.
             * This block is commonly known as the "`broadcast`" block.
             *
             * @param {string} message - The message to broadcast.
             * @returns {void}
             * @description
             * This function broadcasts the specified message to all sprites.
             * The thread resumes immediately after the broadcast.
             * 
             * @example
             * // Broadcast the message "message1".
             * broadcast.fire("message1");
             * 
             * @since v0.0.1
             */
            fire(message: string): void;

            /**
             * Broadcasts a message to all sprites and waits until all scripts triggered by that message have completed.
             * This block is commonly known as the "`broadcast and wait`" block.
             *
             * @param {string} message - The message to broadcast.
             * @returns {void}
             * @description
             * This function broadcasts the specified message to all sprites.
             * The thread resumes after all triggered scripts have completed.
             * 
             * @example
             * // Broadcast the message "message1" and wait for all scripts to complete.
             * broadcast.fireYield("message1");
             * 
             * @since v0.0.1
             */
            fireYield(message: string): void;
        }

        /**
         * The `scratch:broadcast` module provides blocks used in the "broadcast"
         * section of Scratch.
         *
         * Example using the global `broadcast`:
         *
         * ```js
         * broadcast.fire("message1");
         * // Broadcasts the message "message1".
         * ```
         */
        var broadcast: broadcast;
    }
    export = globalThis.broadcast;
}
