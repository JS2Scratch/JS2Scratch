/**
 * The `scratch:sound` module provides blocks used in the "sound"
 * section of Scratch.
 *
 * Example using the global `sound`:
 *
 * ```js
 * sound.playSoundUntilDone("meow");
 * // Plays the sound "meow" until it is done.
 * ```
 */
declare module "sound" {
    import sound = require("scratch:sound");
    export = sound;
}
declare module "scratch:sound" {
    global {
        interface sound {
            /**
             * Plays a sound and waits until it is done.
             *
             * @param {string} soundName - The name of the sound to play.
             * @returns {void}
             * @description
             * This function plays the specified sound and waits until it finishes before continuing.
             * 
             * @example
             * // Play the sound "meow" until it is done.
             * sound.playSoundUntilDone("meow");
             *
             * @since v0.0.1
             */
            playSoundUntilDone(soundName: string): void;

            /**
             * Plays a sound without waiting for it to finish.
             *
             * @param {string} soundName - The name of the sound to play.
             * @returns {void}
             * @description
             * This function plays the specified sound and continues immediately.
             * 
             * @example
             * // Play the sound "bark".
             * sound.playSound("bark");
             *
             * @since v0.0.1
             */
            playSound(soundName: string): void;

            /**
             * Stops all currently playing sounds.
             *
             * @returns {void}
             * @description
             * This function stops all sounds that are currently playing.
             * 
             * @example
             * // Stop all sounds.
             * sound.stopAllSounds();
             *
             * @since v0.0.1
             */
            stopAllSounds(): void;

            /**
             * Changes a sound effect by a certain amount.
             *
             * @param {string} effect - The name of the sound effect to change (e.g., "PITCH", "PAN").
             * @param {number} value - The amount to change the effect by.
             * @returns {void}
             * @description
             * This function changes the specified sound effect by the given amount.
             * 
             * @example
             * // Change the pitch effect by 10.
             * sound.changeEffect("PITCH", 10);
             *
             * @since v0.0.1
             */
            changeEffect(effect: string, value: number): void;

            /**
             * Sets a sound effect to a specific value.
             *
             * @param {string} effect - The name of the sound effect to set (e.g., "PITCH", "PAN").
             * @param {number} value - The value to set the effect to.
             * @returns {void}
             * @description
             * This function sets the specified sound effect to the given value.
             * 
             * @example
             * // Set the pitch effect to 100.
             * sound.setEffect("PITCH", 100);
             *
             * @since v0.0.1
             */
            setEffect(effect: string, value: number): void;

            /**
             * Changes the volume by a certain amount.
             *
             * @param {number} value - The amount to change the volume by.
             * @returns {void}
             * @description
             * This function changes the volume by the specified amount.
             * 
             * @example
             * // Change the volume by -10.
             * sound.changeVolume(-10);
             *
             * @since v0.0.1
             */
            changeVolume(value: number): void;

            /**
             * Sets the volume to a specific value.
             *
             * @param {number} value - The value to set the volume to.
             * @returns {void}
             * @description
             * This function sets the volume to the specified value.
             * 
             * @example
             * // Set the volume to 50.
             * sound.setVolume(50);
             *
             * @since v0.0.1
             */
            setVolume(value: number): void;
        }

        /**
         * The `scratch:sound` module provides blocks used in the "sound"
         * section of Scratch.
         *
         * Example using the global `sound`:
         *
         * ```js
         * sound.playSoundUntilDone("meow");
         * // Plays the sound "meow" until it is done.
         * ```
         */
        var sound: sound;
    }
    export = globalThis.sound;
}
