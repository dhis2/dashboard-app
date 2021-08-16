const config = {
    type: 'app',
    name: 'dashboard',
    title: 'Dashboard',
    coreApp: true,

    pwa: {
        enabled: true,
        caching: {
            patternsToOmit: [
                'dashboards/[a-zA-Z0-9]*',
                'visualizations',
                'analytics',
                'maps',
                'eventCharts',
                'eventReports',
                'geoFeatures',
                'cartodb-basemaps-a.global.ssl.fastly.net',
            ],
        },
    },

    entryPoints: {
        app: './src/AppWrapper.js',
    },
}

module.exports = config
