/**
 * The `scratch:sensing` module provides blocks used in the "sensing"
 * section of Scratch.
 *
 * Example using the global `sensing`:
 *
 * ```js
 * sensing.ask("What's your name?");
 * // Asks the question "What's your name?" and waits for a response.
 * ```
 */
declare module "sensing" {
    import sensing = require("scratch:sensing");
    export = sensing;
}
declare module "scratch:sensing" {
    global {
        interface sensing {
            /**
             * Asks a question and waits for a response.
             *
             * @param {string} question - The question to ask.
             * @returns {void}
             * @description
             * This function asks the specified question and waits for a response.
             * 
             * @example
             * // Ask the question "What's your name?" and wait for a response.
             * sensing.ask("What's your name?");
             *
             * @since v0.0.1
             */
            ask(question: string): void;

            /**
             * Resets the timer.
             *
             * @returns {void}
             * @description
             * This function resets the timer.
             * 
             * @example
             * // Reset the timer.
             * sensing.resetTimer();
             *
             * @since v0.0.1
             */
            resetTimer(): void;

            /**
             * Sets the drag mode of the sprite.
             *
             * @param {"draggable" | "not draggable"} mode - The drag mode to set.
             * @returns {void}
             * @description
             * This function sets the drag mode of the sprite to either "draggable" or "not draggable".
             * 
             * @example
             * // Set the sprite to be draggable.
             * sensing.setDragMode("draggable");
             *
             * @since v0.0.1
             */
            setDragMode(mode: "draggable" | "not draggable"): void;

            /**
             * Checks if the sprite is touching a specified object.
             *
             * @param {string} object - The object to check.
             * @returns {boolean} True if touching, false otherwise.
             * @description
             * This function checks if the sprite is touching the specified object.
             *
             * @example
             * // Check if touching the edge.
             * sensing.touching("edge");
             *
             * @since v0.0.1
             */
            touching(object: string): boolean;

            /**
             * Checks if the sprite is touching a specified color.
             *
             * @param {string} color - The color to check.
             * @returns {boolean} True if touching, false otherwise.
             * @description
             * This function checks if the sprite is touching the specified color.
             *
             * @example
             * // Check if touching the color red.
             * sensing.touchingColor("#FF0000");
             *
             * @since v0.0.1
             */
            touchingColor(color: string): boolean;

            /**
             * Checks if one color is touching another color.
             *
             * @param {string} color1 - The first color.
             * @param {string} color2 - The second color.
             * @returns {boolean} True if the colors are touching, false otherwise.
             * @description
             * This function checks if one color is touching another color.
             *
             * @example
             * // Check if red is touching blue.
             * sensing.colorIsTouchingColor("#FF0000", "#0000FF");
             *
             * @since v0.0.1
             */
            colorIsTouchingColor(color1: string, color2: string): boolean;

            /**
             * Calculates the distance to a specified object.
             *
             * @param {string} object - The object to measure the distance to.
             * @returns {number} The distance to the object.
             * @description
             * This function calculates the distance to the specified object.
             *
             * @example
             * // Get the distance to the mouse pointer.
             * sensing.distanceTo("mouse");
             *
             * @since v0.0.1
             */
            distanceTo(object: string): number;

            /**
             * Checks if the mouse is down.
             *
             * @returns {boolean} True if the mouse is down, false otherwise.
             * @description
             * This function checks if the mouse is down.
             *
             * @example
             * // Check if the mouse is down.
             * sensing.mouseDown();
             *
             * @since v0.0.1
             */
            mouseDown(): boolean;

            /**
             * Checks if a specified key is pressed.
             *
             * @param {string} key - The key to check.
             * @returns {boolean} True if the key is pressed, false otherwise.
             * @description
             * This function checks if the specified key is pressed.
             *
             * @example
             * // Check if the space key is pressed.
             * sensing.keyDown("space");
             *
             * @since v0.0.1
             */
            keyDown(key: string): boolean;

            /**
             * Gets a specified item from an object.
             *
             * @param {string} property - The property to get.
             * @param {string} object - The object to get the property from.
             * @returns {any} The value of the property.
             * @description
             * This function gets the specified property from the object.
             *
             * @example
             * // Get the backdrop number of the stage.
             * sensing.itemOfObject("backdrop #", "stage");
             *
             * @since v0.0.1
             */
            itemOfObject(property: string, object: string): any;

            /**
             * Gets the current value of a specified time-related property.
             *
             * @param {string} property - The time-related property to get.
             * @returns {number} The current value of the property.
             * @description
             * This function gets the current value of the specified time-related property.
             *
             * @example
             * // Get the current year.
             * sensing.current("year");
             *
             * @since v0.0.1
             */
            current(property: string): number;
        }

        /**
         * The `scratch:sensing` module provides blocks used in the "sensing"
         * section of Scratch.
         *
         * Example using the global `sensing`:
         *
         * ```js
         * sensing.ask("What's your name?");
         * // Asks the question "What's your name?" and waits for a response.
         * ```
         */
        var sensing: sensing;
    }
    export = globalThis.sensing;
}
