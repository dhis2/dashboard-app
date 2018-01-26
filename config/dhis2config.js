const dhisConfigPath =
    process.env.DHIS2_HOME && `${process.env.DHIS2_HOME}/config`;
let config;

try {
    config = require(dhisConfigPath);
} catch (e) {
    // Failed to load config file - use default config
    console.warn(`\nWARNING! Failed to load DHIS config:`, e.message);
    config = {
        baseUrl: 'http://localhost:8080',
        authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=', // admin:district
    };
}
const dhisConfig = config;

const scriptPrefix = dhisConfig.baseUrl;

const bypass = (req, res, opt) => {
    req.headers.Authorization = dhisConfig.authorization;
    console.log(
        '[PROXY]'.cyan.bold,
        req.method.green.bold,
        req.url.magenta,
        '=>'.dim,
        opt.target.dim
    );
};

module.exports = {
    dhisConfig,
    scriptPrefix,
    bypass,
};
