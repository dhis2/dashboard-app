const {
    networkShim,
    chromeAllowXSiteCookies,
    cucumberPreprocessor,
} = require('@dhis2/cypress-plugins')
const getCypressEnvVars = require('./getCypressEnvVars.js')

module.exports = (on, config) => {
    networkShim(on)
    chromeAllowXSiteCookies(on)
    cucumberPreprocessor(on, config)
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

    config.env = getCypressEnvVars(config)

    return config
}
