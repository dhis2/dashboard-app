const fs = require('fs')
const path = require('path')

const CUCUMBER_FILE_PATH = './cypress/e2e_cucumber'
const VANILLA_FILE_PATH = './cypress/e2e'

const getAllFiles = (dirPath, arrayOfFiles = []) => {
    const files = fs.readdirSync(dirPath)

    files.forEach((file) => {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles)
        } else if (
            dirPath === CUCUMBER_FILE_PATH &&
            path.extname(file) === '.feature'
        ) {
            arrayOfFiles.push(path.join(dirPath, file))
        } else if (dirPath === VANILLA_FILE_PATH && file.endsWith('.cy.js')) {
            arrayOfFiles.push(path.join(dirPath, file))
        }
    })

    return arrayOfFiles
}

const createGroups = (files, numberOfGroups = 8) => {
    const groups = []
    for (let i = 0; i < numberOfGroups; i++) {
        groups.push([])
    }

    files.forEach((file, index) => {
        groups[index % numberOfGroups].push(file)
    })

    return groups.map((group, index) => ({ id: index + 1, tests: group }))
}

const specs = [
    ...getAllFiles(CUCUMBER_FILE_PATH),
    ...getAllFiles(VANILLA_FILE_PATH),
]
const groupedSpecs = createGroups(specs)

console.log(JSON.stringify(groupedSpecs))
