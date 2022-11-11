const config = {
    type: 'app',
    name: 'dashboard',
    title: 'Dashboard',
    coreApp: true,

    pwa: {
        enabled: true,
        caching: {
            patternsToOmitFromAppShell: [
                // Make these specific as possible --
                // unspecific ones have caused errors on instances with
                // 'analytics' in the name, for example
                /\/api\/(\d+\/)?dashboards\/[a-zA-Z0-9]*/,
                /\/api\/(\d+\/)?maps/,
                /\/api\/(\d+\/)?eventVisualizations/,
                /\/api\/(\d+\/)?visualizations/,
                /\/api\/(\d+\/)?analytics/,
                /\/api\/(\d+\/)?geoFeatures/,
                /cartodb-basemaps-[a-c]\.global\.ssl\.fastly\.net/,
            ],
        },
    },

    entryPoints: {
        app: './src/AppWrapper.js',
    },
}

module.exports = config
