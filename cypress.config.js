const {
    networkShim,
    chromeAllowXSiteCookies,
} = require('@dhis2/cypress-plugins')
const { defineConfig } = require('cypress')

async function setupNodeEvents(on, config) {
    networkShim(on, config)
    chromeAllowXSiteCookies(on, config)
    return config
}

module.exports = defineConfig({
    video: true,
    projectId: '5fk191',
    viewportWidth: 1280,
    viewportHeight: 800,
    chromeWebSecurity: false,
    e2e: {
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        setupNodeEvents,
        baseUrl: 'http://localhost:3000',
        specPattern: 'cypress/e2e/**/*.cy.js',
    },
})
