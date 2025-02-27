const { config } = require('@dhis2/cli-style')

module.exports = {
    ...require(config.prettier),
    overrides: [
        {
            files: 'pull_request_template.md',
            options: {
                tabWidth: 2,
            },
        },
    ],
}
