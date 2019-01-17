module.exports = {
    collectCoverageFrom: ['src/**/*.{js,jsx,mjs}'],
    setupFiles: ['<rootDir>/config/polyfills.js', '<rootDir>/config/shim.js'],
    setupTestFrameworkScriptFile: '<rootDir>/config/testSetup.js',
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
        // 'node_modules/(?!(@dhis2/d2-ui-[a-z-]+)/)',
        'node_modules/(?!(@dhis2/ui)/)',
    ],
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
