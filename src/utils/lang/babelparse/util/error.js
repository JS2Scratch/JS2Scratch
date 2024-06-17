const chalk = require('chalk')

module.exports = {
    enum: {
        Unsupported: "001",
        Null: "002",
        InvalidArguments: "003"
    },

    throw: ((Code, Message) => {
        console.error(
            chalk.red(chalk.bold(
                `[error - ${Code}] - `
            )) + Message
        ) 

        process.exit(1)
    }),

    warn: ((Message) => {
        return  chalk.yellow(chalk.bold(
            `[warn] - `
        )) + Message
    }),

    bug: ((Message) => {
        return  chalk.blue(chalk.bold(
            `[bug] - `
        )) + Message + " This is a bug."
    }),
}