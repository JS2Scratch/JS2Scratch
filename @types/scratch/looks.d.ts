/**
 * The `scratch:looks` module provides blocks used in the "looks"
 * section of Scratch.
 *
 * Example using the global `looks`:
 *
 * ```js
 * looks.hide();
 * // Hides the sprite.
 * ```
 */
declare module "looks" {
    import looks = require("scratch:looks");
    export = looks;
}
declare module "scratch:looks" {
    global {
        interface looks {
            /**
             * Makes the sprite say the given text for the given amount of seconds.
             * Yields the thread. This block is known as the "`Say for secs`" block.
             *
             * @param {string} Message - The text the sprite will display.
             * @param {number} Time - The amount of seconds to yield the thread for.
             * @returns {void}
             * @description
             * This function yields the thread for the given amount of time while the character says something.
             * The thread resumes after that timeframe has ended.
             * 
             * @example
             * // Say hello for 4 seconds.
             * looks.sayForSeconds("hello", 4);
             * 
             * // Say hello for a second.
             * looks.sayForSeconds("hello", 1);
             *
             * @since v0.0.1
             */
            sayForSeconds(Message: string, Time: number): void;

            /**
             * Stops the thread from running and makes the sprite say something.
             * This block is commonly known as the "`say`" block.
             *
             * @param {string} Message - The text the sprite is going to say.
             * @returns {void}
             * @description
             * This function stops the thread and forces the sprite to say the given text.
             * The thread cannot be resumed.
             * 
             * @example
             * looks.say("Hello World!");
             *
             * @since v0.0.1
             */
            say(Message: string): void;

            /**
             * Makes the sprite think the given text for the given amount of seconds.
             * Yields the thread. This block is known as the "`Think for secs`" block.
             *
             * @param {string} Message - The text the sprite will display.
             * @param {number} Time - The amount of seconds to yield the thread for.
             * @returns {void}
             * @description
             * This function yields the thread for the given amount of time while the character thinks something.
             * The thread resumes after that timeframe has ended.
             * 
             * @example
             * // Think "Hmm..." for 4 seconds.
             * looks.thinkForSecs("Hmm...", 4);
             *
             * @since v0.0.1
             */
            thinkForSecs(Message: string, Time: number): void;

            /**
             * Makes the sprite think the given text.
             * This block is commonly known as the "`think`" block.
             *
             * @param {string} Message - The text the sprite is going to think.
             * @returns {void}
             * @description
             * This function makes the sprite think the given text.
             * 
             * @example
             * looks.think("What should I do?");
             *
             * @since v0.0.1
             */
            think(Message: string): void;

            /**
             * Changes the sprite to the next costume in the list.
             *
             * @returns {void}
             * @description
             * This function changes the sprite to the next costume in its list of costumes.
             * 
             * @example
             * looks.nextCostume();
             *
             * @since v0.0.1
             */
            nextCostume(): void;

            /**
             * Changes the sprite to the previous costume in the list.
             *
             * @returns {void}
             * @description
             * This function changes the sprite to the previous costume in its list of costumes.
             * 
             * @example
             * looks.previousCostume();
             *
             * @since v0.0.1
             */
            previousCostume(): void;

            /**
             * Changes the sprite to the next backdrop in the list.
             *
             * @returns {void}
             * @description
             * This function changes the sprite to the next backdrop in its list of backdrops.
             * 
             * @example
             * looks.nextBackdrop();
             *
             * @since v0.0.1
             */
            nextBackdrop(): void;

            /**
             * Changes the sprite to the previous backdrop in the list.
             *
             * @returns {void}
             * @description
             * This function changes the sprite to the previous backdrop in its list of backdrops.
             * 
             * @example
             * looks.previousBackdrop();
             *
             * @since v0.0.1
             */
            previousBackdrop(): void;

            /**
             * Changes the size of the sprite by a specified amount.
             *
             * @param {number} Amount - The amount to change the size by.
             * @returns {void}
             * @description
             * This function changes the size of the sprite by the specified amount.
             * 
             * @example
             * looks.changeSizeBy(10);
             *
             * @since v0.0.1
             */
            changeSizeBy(Amount: number): void;

            /**
             * Sets the size of the sprite to a specified percentage.
             *
             * @param {number} Size - The percentage to set the size to.
             * @returns {void}
             * @description
             * This function sets the size of the sprite to the specified percentage.
             * 
             * @example
             * looks.setSizeTo(150);
             *
             * @since v0.0.1
             */
            setSizeTo(Size: number): void;

            /**
             * Sets the layer of the sprite to a specified layer.
             *
             * @param {"font" | "back"} Layer - The layer to set the sprite too.
             * @returns {void}
             * @description
             * This function sets the layer of the sprite.
             * 
             * @example
             * looks.setLayer("front");
             *
             * @since v0.0.1
             */
            setLayer(Layer: "font" | "back"): void;

            
            /**
             * Changes the layer of the sprite.
             *
             * @param {number} Layer - Which way to move the sprite.
             * @param {number} Value - THow many times to change the layer.
             * @returns {void}
             * @description
             * This function changes the layer of the sprite.
             * 
             * @example
             * looks.changeLayer("forwards", 3);
             *
             * @since v0.0.1
             */
            changeLayer(Layer: "forward" | "backward", Value: number): void;

            /**
             * Clears all graphic effects on the sprite.
             *
             * @returns {void}
             * @description
             * This function clears all graphic effects applied to the sprite.
             * 
             * @example
             * looks.clearGraphicEffects();
             *
             * @since v0.0.1
             */
            clearGraphicEffects(): void;

            /**
             * Makes the sprite visible.
             *
             * @returns {void}
             * @description
             * This function makes the sprite visible.
             * 
             * @example
             * looks.show();
             *
             * @since v0.0.1
             */
            show(): void;

            /**
             * Hides the sprite.
             *
             * @returns {void}
             * @description
             * This function hides the sprite.
             * 
             * @example
             * looks.hide();
             *
             * @since v0.0.1
             */
            hide(): void;
        }
        
        var looks: looks;
    }
    export = globalThis.looks;
}
