const fs = require('fs')
const pathlib = require('path')

module.exports = {
    createDir: ((path = __dirname, name = "New Folder")  => {
        const pChosen = pathlib.join(path, name)

        if (fs.existsSync(pChosen)) return pChosen

        fs.mkdirSync(pathlib.join(path, name))

        return pChosen
    }),

    createFile: ((path = __dirname, name = "New File", content = "") => {
        const pChosen = pathlib.join(path, name)

        if (fs.existsSync(pChosen))  return pChosen
        fs.writeFileSync(pChosen, content)

        return pChosen
    }),

    readFile: ((path = __dirname) => {
        return fs.readFileSync(path).toString()
    }),

    readFileAsJSON: ((path = __dirname) => {
        return fs.readFileSync(path).toJSON()
    })
}