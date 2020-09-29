/*
Retrieves Cypress environment variables from .env.cypress / .env.cypress.local
*/

const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

module.exports = function getCypressEnvVariables(config) {
    const { fileServerFolder, env: inputCypressEnv } = config

    const CONFIG_NAME_BASE = '.env.cypress'

    const dotenvFiles = [`${CONFIG_NAME_BASE}.local`, CONFIG_NAME_BASE]

    const allEnv = dotenvFiles.reduce((acc, file) => {
        const absolutePath = path.resolve(fileServerFolder, file)
        if (fs.existsSync(absolutePath)) {
            const parsed = dotenv.parse(
                fs.readFileSync(absolutePath, { encoding: 'utf8' })
            )
            return {
                ...parsed,
                ...acc,
            }
        }
        return acc
    }, inputCypressEnv)

    return Object.keys(allEnv).reduce((acc, key) => {
        if (!key.startsWith('REACT_')) {
            acc[key] = allEnv[key]
        }
        return acc
    }, {})
}
