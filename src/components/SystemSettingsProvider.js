import React, { useContext, useState, useEffect, createContext } from 'react'
import PropTypes from 'prop-types'
import settingsQuery from '../api/settings'

export const DEFAULT_SETTINGS = {
    displayNameProperty: 'displayName',
    keyGatherAnalyticalObjectStatisticsInDashboardViews: false,
}

export const SystemSettingsCtx = createContext({})

const SystemSettingsProvider = ({ engine, children }) => {
    const [settings, setSettings] = useState([])

    useEffect(() => {
        async function fetchData() {
            const { systemSettings } = await engine.query(settingsQuery)

            setSettings(Object.assign({}, DEFAULT_SETTINGS, systemSettings))
        }
        fetchData()
    }, [])

    return (
        <SystemSettingsCtx.Provider
            value={{
                settings,
            }}
        >
            {children}
        </SystemSettingsCtx.Provider>
    )
}

SystemSettingsProvider.propTypes = {
    children: PropTypes.node,
    engine: PropTypes.object,
}

export default SystemSettingsProvider

export const useSystemSettings = () => useContext(SystemSettingsCtx)
