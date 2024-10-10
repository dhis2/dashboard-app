const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.stylelint],
    rules: {
        'csstools/use-logical': [
            true,
            {
                // overriding the default config to error since this should be all fixed in this repo
                severity: 'error',
            },
        ],
    },
}
