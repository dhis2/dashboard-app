import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useContext, useState, useEffect, createContext } from 'react'
import { useFetchSupersetBaseUrl } from '../api/supersetGateway.js'
import {
    systemSettingsQuery,
    renameSystemSettings,
    DEFAULT_SETTINGS,
} from '../api/systemSettings.js'
import styles from './styles/SystemSettingsProvider.module.css'

export const SystemSettingsCtx = createContext({})

const SystemSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(null)
    const [hasSupersetConfigIssue, setHasSupersetConfigIssue] = useState(false)
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
                    setHasSupersetConfigIssue(true)
                }
            }

            setSettings(resolvedSystemSettings)
        }
        fetchData()
    }, [engine, fetchSupersetBaseUrl])

    if (hasSupersetConfigIssue) {
        return (
            <NoticeBox
                error
                title={i18n.t('System configuration issue')}
                className={styles.configurationError}
            >
                {i18n.t(
                    'External Superset dashboards have been enabled, but the Superset Gateway was unavailble. Please contact your system administrator.'
                )}
            </NoticeBox>
        )
    }
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
    return embeddedDashboardsEnabled && !!supersetBaseUrl
}
export const useSupersetBaseUrl = () => {
    const {
        systemSettings: { supersetBaseUrl },
    } = useSystemSettings()
    return supersetBaseUrl ?? null
}
