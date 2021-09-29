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
                'maps',
                'eventCharts',
                'eventReports',
                'analytics',
                'geoFeatures',
                'cartodb-basemaps-a.global.ssl.fastly.net',
                'cartodb-basemaps-b.global.ssl.fastly.net',
                'messageConversations',
            ],
        },
    },

    entryPoints: {
        app: './src/AppWrapper.js',
    },
}

module.exports = config
