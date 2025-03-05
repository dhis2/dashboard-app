import PropTypes from 'prop-types'
import React, { useContext, createContext } from 'react'

export const InstalledAppsCtx = createContext({
    apps: [],
    bundledApps: [],
})

const appsData = {
    apps: [
        {
            key: 'app-widget',
            name: 'Scorecard',
            appType: 'DASHBOARD_WIDGET',
            launchUrl: 'https://iframe/app/widget/scorecard',
        },
        {
            key: 'app-widget-no-title',
            name: 'Scorecard but hide the title',
            launchUrl: 'https://iframe/app/widget/scorecard',
            appType: 'DASHBOARD_WIDGET',
            settings: {
                dashboardWidget: {
                    hideTitle: true,
                },
            },
        },
        {
            key: 'dashboard-plugin',
            name: 'Dashboard plugin',
            appType: 'APP',
            pluginLaunchUrl: 'https://plugin/iframe/url',
        },
    ],
    bundledApps: [],
}

const InstalledAppsProvider = ({ children }) => {
    return (
        <InstalledAppsCtx.Provider value={appsData}>
            {children}
        </InstalledAppsCtx.Provider>
    )
}

InstalledAppsProvider.propTypes = {
    children: PropTypes.node,
}

export default InstalledAppsProvider

export const useInstalledApps = () => {
    const { apps } = useContext(InstalledAppsCtx)
    return apps
}
