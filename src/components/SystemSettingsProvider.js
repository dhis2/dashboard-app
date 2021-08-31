import { useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useContext, useState, useEffect, createContext } from 'react'
import {
    systemSettingsQuery,
    renameSystemSettings,
    DEFAULT_SETTINGS,
} from '../api/systemSettings'

export const SystemSettingsCtx = createContext({})

const SystemSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState([])
    const engine = useDataEngine()

    useEffect(() => {
        async function fetchData() {
            const { systemSettings } = await engine.query({
                systemSettings: systemSettingsQuery,
            })

            setSettings(
                Object.assign(
                    {},
                    renameSystemSettings(DEFAULT_SETTINGS),
                    renameSystemSettings(systemSettings)
                )
            )
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
}

export default SystemSettingsProvider

export const useSystemSettings = () => useContext(SystemSettingsCtx)
