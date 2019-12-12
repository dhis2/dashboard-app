const { config } = require('@dhis2/cli-style');
const husky = require(config.husky);

module.exports = {
    hooks: {
        ...husky.hooks,
        'pre-commit': 'yarn validate-commit',
        'pre-push': 'yarn validate-push',
    },
};
