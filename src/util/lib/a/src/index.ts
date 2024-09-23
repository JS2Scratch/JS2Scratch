import { createImplementation } from "../utils/library";

module.exports = {
    type_implements: [
        createImplementation("NumericLiteral", (() => {
            console.log("NUMBER.");
        }))
    ]
};