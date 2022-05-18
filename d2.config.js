const config = {
    type: 'app',
    name: 'dashboard',
    title: 'Dashboard',
    coreApp: true,
    id: '97192bad-afc0-458e-96b9-cdd351f2896b',
    minDHIS2Version: '2.38',

    pwa: {
        enabled: true,
        caching: {
            patternsToOmit: [
                'dashboards/[a-zA-Z0-9]*',
                'visualizations',
                'analytics',
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
