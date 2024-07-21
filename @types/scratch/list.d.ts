/**
 * The `scratch:list` module provides blocks used in the "list"
 * section of Scratch.
 *
 * Example using the global `list`:
 *
 * ```js
 * list.new("myList", ["apple", "banana", "cherry"]);
 * // Creates a new list called "myList" with the items "apple", "banana", and "cherry".
 * ```
 */
declare module "list" {
    import list = require("scratch:list");
    export = list;
}
declare module "scratch:list" {
    global {
        interface list {
            /**
             * Creates a new list with the given name and items.
             *
             * @param {string} name - The name of the list.
             * @param {Array<any>} items - The items to initialize the list with.
             * @returns {void}
             * @description
             * This function initializes a new list with the specified items.
             * 
             * @example
             * // Create a new list named "myList" with three items.
             * list.newList("myList", ["apple", "banana", "cherry"]);
             *
             * @since v0.0.1
             */
            newList(name: string, items: Array<any>): void;

            /**
             * Adds an item to the end of the list.
             *
             * @param {string} name - The name of the list.
             * @param {any} item - The item to add to the list.
             * @returns {void}
             * @description
             * This function appends an item to the end of the specified list.
             * 
             * @example
             * // Add an item to the list named "myList".
             * list.push("myList", "grape");
             *
             * @since v0.0.1
             */
            push(name: string, item: any): void;

            /**
             * Removes the last item from the list.
             *
             * @param {string} name - The name of the list.
             * @returns {void}
             * @description
             * This function removes the last item from the specified list.
             * 
             * @example
             * // Remove the last item from the list named "myList".
             * list.pop("myList");
             *
             * @since v0.0.1
             */
            pop(name: string): void;

            /**
             * Removes the first item from the list.
             *
             * @param {string} name - The name of the list.
             * @returns {void}
             * @description
             * This function removes the first item from the specified list.
             * 
             * @example
             * // Remove the first item from the list named "myList".
             * list.shift("myList");
             *
             * @since v0.0.1
             */
            shift(name: string): void;

            /**
             * Removes all items from the list.
             *
             * @param {string} name - The name of the list.
             * @returns {void}
             * @description
             * This function clears all items from the specified list.
             * 
             * @example
             * // Clear all items from the list named "myList".
             * list.clear("myList");
             *
             * @since v0.0.1
             */
            clear(name: string): void;

            /**
             * Inserts an item at a specific index in the list.
             *
             * @param {string} name - The name of the list.
             * @param {number} index - The index to insert the item at.
             * @param {any} item - The item to insert into the list.
             * @returns {void}
             * @description
             * This function inserts an item at the specified index in the list.
             * 
             * @example
             * // Insert an item at index 2 in the list named "myList".
             * list.insert("myList", 2, "orange");
             *
             * @since v0.0.1
             */
            insert(name: string, index: number, item: any): void;

            /**
             * Deletes the item at a specific index from the list.
             *
             * @param {string} name - The name of the list.
             * @param {number} index - The index of the item to delete.
             * @returns {void}
             * @description
             * This function deletes the item at the specified index from the list.
             * 
             * @example
             * // Delete the item at index 1 from the list named "myList".
             * list.deleteIndex("myList", 1);
             *
             * @since v0.0.1
             */
            deleteIndex(name: string, index: number): void;

            /**
             * Replaces the item at a specific index in the list with a new item.
             *
             * @param {string} name - The name of the list.
             * @param {number} index - The index of the item to replace.
             * @param {any} item - The new item to insert into the list.
             * @returns {void}
             * @description
             * This function replaces the item at the specified index in the list with a new item.
             * 
             * @example
             * // Replace the item at index 0 in the list named "myList" with a new item.
             * list.replace("myList", 0, "kiwi");
             *
             * @since v0.0.1
             */
            replace(name: string, index: number, item: any): void;

            /**
             * Shows the specified list on the stage.
             *
             * @param {string} name - The name of the list.
             * @returns {void}
             * @description
             * This function makes the specified list visible on the stage.
             * 
             * @example
             * // Show the list named "myList" on the stage.
             * list.show("myList");
             *
             * @since v0.0.1
             */
            show(name: string): void;

            /**
             * Hides the specified list from the stage.
             *
             * @param {string} name - The name of the list.
             * @returns {void}
             * @description
             * This function makes the specified list invisible on the stage.
             * 
             * @example
             * // Hide the list named "myList" from the stage.
             * list.hide("myList");
             *
             * @since v0.0.1
             */
            hide(name: string): void;

            /**
             * Gets the item at a specific index from the list.
             *
             * @param {string} name - The name of the list.
             * @param {number} index - The index of the item to get.
             * @returns {any} The item at the specified index.
             * @description
             * This function returns the item at the specified index in the list.
             * 
             * @example
             * // Get the item at index 1 from the list named "myList".
             * let item = list.getItemOfList("myList", 1);
             *
             * @since v0.0.1
             */
            getItemOfList(name: string, index: number): any;

            /**
             * Gets the index of a specific item in the list.
             *
             * @param {string} name - The name of the list.
             * @param {any} item - The item to find the index of.
             * @returns {number} The index of the item in the list.
             * @description
             * This function returns the index of the specified item in the list.
             * 
             * @example
             * // Get the index of the item "banana" in the list named "myList".
             * let index = list.getItemIndexInList("myList", "banana");
             *
             * @since v0.0.1
             */
            getItemIndexInList(name: string, item: any): number;

            /**
             * Gets the length of the list.
             *
             * @param {string} name - The name of the list.
             * @returns {number} The length of the list.
             * @description
             * This function returns the length of the specified list.
             * 
             * @example
             * // Get the length of the list named "myList".
             * let length = list.lengthOfList("myList");
             *
             * @since v0.0.1
             */
            lengthOfList(name: string): number;

            /**
             * Checks if the list contains a specific item.
             *
             * @param {string} name - The name of the list.
             * @param {any} item - The item to check for.
             * @returns {boolean} True if the list contains the item, otherwise false.
             * @description
             * This function checks if the specified list contains the given item.
             * 
             * @example
             * // Check if the list named "myList" contains the item "apple".
             * let contains = list.listContainsItem("myList", "apple");
             *
             * @since v0.0.1
             */
            listContainsItem(name: string, item: any): boolean;
        }

        /**
         * The `scratch:list` module provides blocks used in the "list"
         * section of Scratch.
         *
         * Example using the global `list`:
         *
         * ```js
         * list.new("myList", ["apple", "banana", "cherry"]);
         * // Creates a new list called "myList" with the items "apple", "banana", and "cherry".
         * ```
         */
        var list: list;
    }
    export = globalThis.list;
}
