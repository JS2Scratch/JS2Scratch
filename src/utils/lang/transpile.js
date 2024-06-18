const babelParse = require('./babelparse/parse')

// This is purely here so the parser can call itself. 
// I know there's a better way to do this. 
// I'm just not bothered to do it.
module.exports = ((input, fn, preParsed = false) => {
    return babelParse(input, fn, preParsed)
})