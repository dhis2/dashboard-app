const presets = [
    '@babel/react',
    [
        '@babel/env',
        {
            modules: false,
        },
    ],
];

const plugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-object-assign',
    [
        '@babel/plugin-transform-runtime',
        {
            useESModules: true,
            corejs: 2,
        },
    ],
];

module.exports = {
    env: {
        production: {
            presets,
            plugins,
        },
        development: {
            presets,
            plugins,
        },
        test: {
            presets,
            plugins: [
                '@babel/plugin-transform-modules-commonjs',
                '@babel/plugin-transform-object-assign',
                '@babel/plugin-proposal-class-properties',
            ],
        },
    },
};
