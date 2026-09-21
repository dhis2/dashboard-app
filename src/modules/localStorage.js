import { NAV_TABS, NAV_TAB_IDS } from './navigationTabs.js'

export const getPreferredDashboardId = (username) =>
    localStorage.getItem(`dhis2.dashboard.current.${username}`) || undefined

export const storePreferredDashboardId = (username, dashboardId) => {
    localStorage.setItem(`dhis2.dashboard.current.${username}`, dashboardId)
}

const navTabKey = (username) => `dhis2.dashboard.navTab.${username}`

export const getNavigationTab = (username) => {
    const stored = localStorage.getItem(navTabKey(username))

    return NAV_TAB_IDS.includes(stored) ? stored : NAV_TABS.ALL
}

export const storeNavigationTab = (username, tab) => {
    try {
        localStorage.setItem(navTabKey(username), tab)
    } catch (error) {
        console.info('Failed to store navigation tab', error)
    }
}

export const getPluginOverrides = () =>
    (process.env.NODE_ENV !== 'production' &&
        JSON.parse(localStorage.getItem('dhis2.dashboard.pluginOverrides'))) ||
    undefined
