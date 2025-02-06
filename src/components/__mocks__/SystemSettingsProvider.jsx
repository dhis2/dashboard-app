import PropTypes from 'prop-types'
import React, { useContext, useState, createContext } from 'react'

export const SystemSettingsCtx = createContext({})

const SystemSettingsProvider = ({ children }) => {
    const [settings] = useState({
        keyDashboardContextMenuItemOpenInRelevantApp: true,
        keyDashboardContextMenuItemShowInterpretationsAndDetails: true,
        keyDashboardContextMenuItemSwitchViewType: true,
        keyDashboardContextMenuItemViewFullscreen: true,
        keyGatherAnalyticalObjectStatisticsInDashboardViews: false,
    })

    return (
        <SystemSettingsCtx.Provider
            value={{
                systemSettings: settings,
            }}
        >
            {children}
        </SystemSettingsCtx.Provider>
    )
}

SystemSettingsProvider.propTypes = {
    children: PropTypes.node,
}

export default SystemSettingsProvider

export const useSystemSettings = () => useContext(SystemSettingsCtx)
