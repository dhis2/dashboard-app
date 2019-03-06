module.exports = {
    collectCoverageFrom: ['src/**/*.{js,jsx,mjs}'],
    setupFiles: ['<rootDir>/config/polyfills.js', '<rootDir>/config/shim.js'],
    setupFilesAfterEnv: ['<rootDir>/config/testSetup.js'],
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{js,jsx,mjs}',
        '<rootDir>/src/**/?(*.)(spec|test).{js,jsx,mjs}',
    ],
    testEnvironment: 'node',
    testURL: 'http://localhost',
    transform: {
        '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest',
        '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
        '^(?!.*\\.(js|jsx|mjs|css|json)$)':
            '<rootDir>/config/jest/fileTransform.js',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(data-visualizer-plugin|d2-ui|lodash-es|@dhis2/d2-ui-[a-z-]+)/)',
    ],
    // verbose: true,
    moduleNameMapper: {
        '^react-native$': 'react-native-web',
    },
    moduleFileExtensions: [
        'web.js',
        'mjs',
        'js',
        'json',
        'web.jsx',
        'jsx',
        'node',
    ],
};
