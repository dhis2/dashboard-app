const plugins = require('@dhis2/cli-utils-cypress/plugins')

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
}
