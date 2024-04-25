import { useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useContext, useState, useEffect, createContext } from 'react'
import { userSettingsQuery } from '../api/userSettings.js'

export const UserSettingsCtx = createContext({})

const UserSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState([])
    const engine = useDataEngine()

    useEffect(() => {
        async function fetchData() {
            const { userSettings } = await engine.query({
                userSettings: userSettingsQuery,
            })

            setSettings({
                ...userSettings,
                displayProperty:
                    userSettings.keyAnalysisDisplayProperty === 'name'
                        ? 'displayName'
                        : 'displayShortName',
            })
        }
        fetchData()
    }, [engine])

    return (
        <UserSettingsCtx.Provider
            value={{
                userSettings: settings,
            }}
        >
            {children}
        </UserSettingsCtx.Provider>
    )
}

UserSettingsProvider.propTypes = {
    children: PropTypes.node,
}

export default UserSettingsProvider

export const useUserSettings = () => useContext(UserSettingsCtx)
