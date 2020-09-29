const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact],
    globals: {
        Cypress: 'readonly',
        after: 'readonly',
        before: 'readonly',
        cy: 'readonly',
    },
}
