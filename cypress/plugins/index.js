const plugins = require('@dhis2/cli-utils-cypress/plugins')
const registerReportPortalPlugin = require('@reportportal/agent-js-cypress/lib/plugin')
const getCypressEnvVars = require('./getCypressEnvVars.js')

module.exports = (on, config) => registerReportPortalPlugin(on, config)

module.exports = (on, config) => {
    on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
            const disabledChromiumFeatures = [
                'SameSiteByDefaultCookies',
                'CookiesWithoutSameSiteMustBeSecure',
                'SameSiteDefaultChecksMethodRigorously',
            ]
            launchOptions.args.push(
                `--disable-features=${disabledChromiumFeatures.join(',')}`
            )
        }

        return launchOptions
    })

    plugins(on, config)

    config.env = getCypressEnvVars(config)
    config.reporterOptions.apiKey = process.env.CYPRESS_RP_API_KEY

    return config
}
