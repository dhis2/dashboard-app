const plugins = require('@dhis2/cli-utils-cypress/plugins')
// const getCypressEnvVariables = require('./getCypressEnvVariables')
const path = require('path')

module.exports = (on, config) => {
    on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
            launchOptions.extensions.push(
                path.join(__dirname, '/ignore-x-frame-headers')
            )

            launchOptions.args.push(
                '--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure,SameSiteDefaultChecksMethodRigorously'
            )
        }

        return launchOptions
    })

    plugins(on, config)

    // Add additional plugins here
    // config.env = getCypressEnvVariables(config)
    return config
}
