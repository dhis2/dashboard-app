const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact, 'plugin:cypress/recommended'],
    overrides: [
        {
            files: ['src/**/*.spec.js'],
            rules: {
                'react/prop-types': 'off',
                'react/display-name': 'off',
                'react/no-unknown-property': 'off',
                'no-unused-vars': ['error', { ignoreRestSiblings: true }],
            },
        },
    ],
}
