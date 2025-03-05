import PropTypes from 'prop-types'
import React, { useContext, createContext } from 'react'

export const InstalledAppsCtx = createContext({
    apps: [],
    bundledApps: [],
})

//const DV_APP_KEY = 'data-visualizer'
//const LL_APP_KEY = 'line-listing'
//const MAPS_APP_KEY = 'maps'
//
//const findAppVersion = (apps, bundledApps, appKey) =>
//    apps.find((app) => app.key === appKey)?.version ||
//    bundledApps.find((app) => app.name === appKey)?.version ||
//    '0.0.0'

const InstalledAppsProvider = ({ children }) => {
    return (
        <InstalledAppsCtx.Provider
            value={{
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
            }}
        >
            {children}
        </InstalledAppsCtx.Provider>
    )
}

InstalledAppsProvider.propTypes = {
    children: PropTypes.node,
}

//const useInstalledAppVersion = (key) => {
//    const { apps, bundledApps } = useContext(InstalledAppsCtx)
//    return findAppVersion(apps, bundledApps, key)
//}

export default InstalledAppsProvider

export const useInstalledApps = () => {
    const { apps } = useContext(InstalledAppsCtx)
    return apps
}
//export const useInstalledDVVersion = () => useInstalledAppVersion(DV_APP_KEY)
//export const useInstalledLLVersion = () => useInstalledAppVersion(LL_APP_KEY)
//export const useInstalledMapsVersion = () =>
//    useInstalledAppVersion(MAPS_APP_KEY)
