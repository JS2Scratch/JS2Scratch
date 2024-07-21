/**
 * The `scratch:motion` module provides blocks used in the "motion"
 * section of Scratch.
 *
 * Example using the global `motion`:
 *
 * ```js
 * motion.move(10);
 * // Moves the sprite 10 steps.
 * ```
 */
declare module "motion" {
    import motion = require("scratch:motion");
    export = motion;
}
declare module "scratch:motion" {
    global {
        interface motion {
            /**
             * Moves the sprite by a specified number of steps.
             * This block is commonly known as the "`move`" block.
             *
             * @param {number} steps - The number of steps to move the sprite.
             * @returns {void}
             * @description
             * This function moves the sprite by the specified number of steps.
             *
             * @example
             * // Move the sprite 10 steps.
             * motion.move(10);
             *
             * @since v0.0.1
             */
            move(steps: number): void;

            /**
             * Turns the sprite clockwise by a specified number of degrees.
             * This block is commonly known as the "`turn right`" block.
             *
             * @param {number} degrees - The number of degrees to turn the sprite clockwise.
             * @returns {void}
             * @description
             * This function turns the sprite clockwise by the specified number of degrees.
             *
             * @example
             * // Turn the sprite clockwise by 15 degrees.
             * motion.turnRight(15);
             *
             * @since v0.0.1
             */
            turnRight(degrees: number): void;

            /**
             * Turns the sprite counterclockwise by a specified number of degrees.
             * This block is commonly known as the "`turn left`" block.
             *
             * @param {number} degrees - The number of degrees to turn the sprite counterclockwise.
             * @returns {void}
             * @description
             * This function turns the sprite counterclockwise by the specified number of degrees.
             *
             * @example
             * // Turn the sprite counterclockwise by 15 degrees.
             * motion.turnLeft(15);
             *
             * @since v0.0.1
             */
            turnLeft(degrees: number): void;

            /**
             * Moves the sprite to a specified X and Y position.
             * This block is commonly known as the "`go to x: y:`" block.
             *
             * @param {number} x - The X position to move the sprite to.
             * @param {number} y - The Y position to move the sprite to.
             * @returns {void}
             * @description
             * This function moves the sprite to the specified X and Y positions.
             *
             * @example
             * // Move the sprite to the X position 100 and Y position -50.
             * motion.gotoXY(100, -50);
             *
             * @since v0.0.1
             */
            gotoXY(x: number, y: number): void;

            /**
             * Moves the sprite to a specified position, which can be either a specific sprite, the mouse pointer, or a random position.
             * This block is commonly known as the "`go to`" block.
             *
             * @param {string} to - The target position ("random", "mouse", or a sprite name).
             * @returns {void}
             * @description
             * This function moves the sprite to the specified target position.
             *
             * @example
             * // Move the sprite to a random position.
             * motion.goto("random");
             *
             * @since v0.0.1
             */
            goto(to: string): void;

            /**
             * Moves the sprite to a specified X and Y position over a specified duration.
             * This block is commonly known as the "`glide`" block.
             *
             * @param {number} secs - The duration of the glide in seconds.
             * @param {number} x - The X position to move the sprite to.
             * @param {number} y - The Y position to move the sprite to.
             * @returns {void}
             * @description
             * This function moves the sprite to the specified X and Y positions over the specified duration.
             *
             * @example
             * // Glide the sprite to the X position 100 and Y position -50 over 2 seconds.
             * motion.glide(2, 100, -50);
             *
             * @since v0.0.1
             */
            glide(secs: number, x: number, y: number): void;

            /**
             * Moves the sprite to a specified position (random, mouse, or a sprite) over a specified duration.
             * This block is commonly known as the "`glide to`" block.
             *
             * @param {string} to - The target position ("random", "mouse", or a sprite name).
             * @param {number} secs - The duration of the glide in seconds.
             * @returns {void}
             * @description
             * This function moves the sprite to the specified target position over the specified duration.
             *
             * @example
             * // Glide the sprite to a random position over 2 seconds.
             * motion.glideTo("random", 2);
             *
             * @since v0.0.1
             */
            glideTo(to: string, secs: number): void;

            /**
             * Points the sprite in a specified direction.
             * This block is commonly known as the "`point in direction`" block.
             *
             * @param {number} direction - The direction to point the sprite in.
             * @returns {void}
             * @description
             * This function points the sprite in the specified direction.
             *
             * @example
             * // Point the sprite in the direction 90 (right).
             * motion.point(90);
             *
             * @since v0.0.1
             */
            point(direction: number): void;

            /**
             * Points the sprite towards a specified target (random, mouse, or a sprite).
             * This block is commonly known as the "`point towards`" block.
             *
             * @param {string} towards - The target to point the sprite towards.
             * @returns {void}
             * @description
             * This function points the sprite towards the specified target.
             *
             * @example
             * // Point the sprite towards the mouse pointer.
             * motion.pointTowards("mouse");
             *
             * @since v0.0.1
             */
            pointTowards(towards: string): void;

            /**
             * Changes the sprite's X position by a specified amount.
             * This block is commonly known as the "`change x by`" block.
             *
             * @param {number} dx - The amount to change the X position by.
             * @returns {void}
             * @description
             * This function changes the sprite's X position by the specified amount.
             *
             * @example
             * // Change the sprite's X position by 10.
             * motion.changeX(10);
             *
             * @since v0.0.1
             */
            changeX(dx: number): void;

            /**
             * Changes the sprite's Y position by a specified amount.
             * This block is commonly known as the "`change y by`" block.
             *
             * @param {number} dy - The amount to change the Y position by.
             * @returns {void}
             * @description
             * This function changes the sprite's Y position by the specified amount.
             *
             * @example
             * // Change the sprite's Y position by 10.
             * motion.changeY(10);
             *
             * @since v0.0.1
             */
            changeY(dy: number): void;

            /**
             * Sets the sprite's X position to a specified value.
             * This block is commonly known as the "`set x to`" block.
             *
             * @param {number} x - The X position to set the sprite to.
             * @returns {void}
             * @description
             * This function sets the sprite's X position to the specified value.
             *
             * @example
             * // Set the sprite's X position to 100.
             * motion.setX(100);
             *
             * @since v0.0.1
             */
            setX(x: number): void;

            /**
             * Sets the sprite's Y position to a specified value.
             * This block is commonly known as the "`set y to`" block.
             *
             * @param {number} y - The Y position to set the sprite to.
             * @returns {void}
             * @description
             * This function sets the sprite's Y position to the specified value.
             *
             * @example
             * // Set the sprite's Y position to -50.
             * motion.setY(-50);
             *
             * @since v0.0.1
             */
            setY(y: number): void;

            /**
             * Makes the sprite bounce if it is on the edge of the stage.
             * This block is commonly known as the "`if on edge, bounce`" block.
             *
             * @returns {void}
             * @description
             * This function makes the sprite bounce if it is on the edge of the stage.
             *
             * @example
             * // Make the sprite bounce if it is on the edge.
             * motion.bounceOnEdge();
             *
             * @since v0.0.1
             */
            bounceOnEdge(): void;

            /**
             * Sets the sprite's rotation style to a specified value.
             * This block is commonly known as the "`set rotation style`" block.
             *
             * @param {string} style - The rotation style ("left-right", "don't rotate", or "all around").
             * @returns {void}
             * @description
             * This function sets the sprite's rotation style to the specified value.
             *
             * @example
             * // Set the sprite's rotation style to "left-right".
             * motion.setRotationStyle("left-right");
             *
             * @since v0.0.1
             */
            setRotationStyle(style: "left-right" | "don't rotate" | "all around"): void;
        }

        /**
         * The `scratch:motion` module provides blocks used in the "motion"
         * section of Scratch.
         *
         * Example using the global `motion`:
         *
         * ```js
         * motion.move(10);
         * // Moves the sprite 10 steps.
         * ```
         */
        var motion: motion;
    }
    export = globalThis.motion;
}
