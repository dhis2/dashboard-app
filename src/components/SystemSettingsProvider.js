import { useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useContext, useState, useEffect, createContext } from 'react'
import { useFetchSupersetBaseUrl } from '../api/supersetGateway.js'
import {
    systemSettingsQuery,
    renameSystemSettings,
    DEFAULT_SETTINGS,
} from '../api/systemSettings.js'

export const SystemSettingsCtx = createContext({})

const SystemSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(null)
    const engine = useDataEngine()
    const fetchSupersetBaseUrl = useFetchSupersetBaseUrl()

    useEffect(() => {
        async function fetchData() {
            const { systemSettings } = await engine.query(
                {
                    systemSettings: systemSettingsQuery,
                },
                {
                    onError: (error) => {
                        console.log('Error', 'systemSettingsQuery', error)
                        setSettings({})
                    },
                }
            )
            const resolvedSystemSettings = {
                ...renameSystemSettings(DEFAULT_SETTINGS),
                ...renameSystemSettings(systemSettings),
            }
            if (resolvedSystemSettings.embeddedDashboardsEnabled) {
                try {
                    resolvedSystemSettings.supersetBaseUrl =
                        await fetchSupersetBaseUrl()
                } catch {
                    resolvedSystemSettings.supersetBaseUrl = null
                }
            }

            setSettings(resolvedSystemSettings)
        }
        fetchData()
    }, [engine, fetchSupersetBaseUrl])

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
export const useIsSupersetSupported = () => {
    const {
        systemSettings: { embeddedDashboardsEnabled, supersetBaseUrl },
    } = useSystemSettings()

    return (
        embeddedDashboardsEnabled &&
        // A populated string if a response was received from the Superset Gateway
        ((typeof supersetBaseUrl === 'string' && supersetBaseUrl.length > 0) ||
            // Or `null` if it was not possible to retreive the baseUrl
            supersetBaseUrl === null)
    )
}
export const useSupersetBaseUrl = () => {
    const {
        systemSettings: { supersetBaseUrl },
    } = useSystemSettings()
    return supersetBaseUrl ?? null
}
