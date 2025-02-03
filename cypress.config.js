const {
    addCucumberPreprocessorPlugin,
} = require('@badeball/cypress-cucumber-preprocessor')
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const { chromeAllowXSiteCookies } = require('@dhis2/cypress-plugins')
const { defineConfig } = require('cypress')
// const {
//     excludeByVersionTags,
// } = require('./cypress/plugins/excludeByVersionTags.js')

async function setupNodeEvents(on, config) {
    await addCucumberPreprocessorPlugin(on, config)
    chromeAllowXSiteCookies(on, config)
    // excludeByVersionTags(on, config)

    on(
        'file:preprocessor',
        createBundler({
            plugins: [createEsbuildPlugin.default(config)],
        })
    )

    return config
}

module.exports = defineConfig({
    projectId: '5fk191',
    chromeWebSecurity: false,
    e2e: {
        setupNodeEvents,
        baseUrl: 'http://localhost:3000',
        specPattern: ['cypress/e2e_cucumber/*.feature', 'cypress/e2e/*.cy.js'],
        viewportWidth: 1280,
        viewportHeight: 800,
        defaultCommandTimeout: 45000,
        /* Globally disable test isolation because the test suite
         * contains many tests with sequential steps */
        testIsolation: false,
        // Record video
        video: true,
        // Enabled to reduce the risk of out-of-memory issues
        experimentalMemoryManagement: true,
        // Set to a low number to reduce the risk of out-of-memory issues
        numTestsKeptInMemory: 5,
        /* When allowing 1 retry on CI, the test suite will pass if
         * it's flaky. And/but we also get to identify flaky tests on the
         * Cypress Dashboard. */
        retries: {
            runMode: 1,
            openMode: 0,
        },
    },
    env: {
        networkMode: 'live',
    },
})
