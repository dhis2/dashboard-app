/*
Retrieves Cypress environment variables from .env / .env.cypress / .env.cypress.local
*/

const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

const CYPRESS_PREFIX = 'cypress_'

module.exports = function getCypressEnvVars(config) {
    const { fileServerFolder, env: inputCypressEnv } = config

    const CONFIG_NAME_BASE = '.env'

    const dotenvFiles = [
        `${CONFIG_NAME_BASE}.local`,
        `${CONFIG_NAME_BASE}.cypress`,
        `${CONFIG_NAME_BASE}.cypress.local`,
        CONFIG_NAME_BASE,
    ]

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
        if (key.toLowerCase().startsWith(CYPRESS_PREFIX)) {
            const cypressKey = key
                .substring(CYPRESS_PREFIX.length)
                .toLowerCase()
            acc[cypressKey] = allEnv[key]
        }
        return acc
    }, {})
}
