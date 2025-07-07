const config = {
    type: 'app',
    name: 'dashboard',
    title: 'Dashboard',
    coreApp: true,
    id: '8a05188c-5b2d-496d-a08e-595810748d52',

    minDHIS2Version: '2.40',

    direction: 'auto',

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
        app: './src/AppWrapper.jsx',
    },
}

module.exports = config
