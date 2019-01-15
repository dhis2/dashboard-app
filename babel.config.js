const presets = [
    '@babel/react',
    'react-app',
    [
        '@babel/preset-env',
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
                '@babel/plugin-proposal-class-properties',
            ],
        },
    },
};

// module.exports = {
//     presets: ['@babel/preset-env', '@babel/preset-react'],
//     plugins: [
//         '@babel/plugin-proposal-class-properties',
//     ],
//     env: {
//         test: {
//             plugins: ['@babel/plugin-transform-modules-commonjs'],
//         },
//     },
// };
