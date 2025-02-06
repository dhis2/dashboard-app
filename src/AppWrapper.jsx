import { CachedDataQueryProvider } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import { D2Shim } from '@dhis2/app-runtime-adapter-d2'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import App from './components/App.jsx'
import SystemSettingsProvider from './components/SystemSettingsProvider.jsx'
import UserSettingsProvider from './components/UserSettingsProvider.jsx'
import WindowDimensionsProvider from './components/WindowDimensionsProvider.jsx'
import configureStore from './configureStore.js'

import './locales/index.js'

const d2Config = {
    schemas: [],
}

// TODO: ER and EV plugins require the auth header in development mode.
// Remove this when these plugins are rewritten
const authorization = process.env.REACT_APP_DHIS2_AUTHORIZATION || null
if (authorization) {
    d2Config.headers = { Authorization: authorization }
}

const query = {
    rootOrgUnits: {
        resource: 'organisationUnits',
        params: {
            fields: 'id,displayName,name',
            userDataViewFallback: true,
            paging: false,
        },
    },
    apps: {
        resource: 'apps',
    },
    currentUser: {
        resource: 'me',
        params: {
            fields: 'id,username,displayName~rename(name),authorities,settings[keyAnalysisDisplayProperty]',
        },
    },
}

const providerDataTransformation = ({ rootOrgUnits, apps, currentUser }) => {
    const lineListingApp = apps.find((app) => app.key === 'line-listing') || {}
    return {
        rootOrgUnits: rootOrgUnits.organisationUnits,
        lineListingAppVersion: lineListingApp.version || '0.0.0',
        currentUser,
        apps,
    }
}

const AppWrapper = () => {
    const dataEngine = useDataEngine()

    return (
        <ReduxProvider store={configureStore(dataEngine)}>
            <CachedDataQueryProvider
                query={query}
                dataTransformation={providerDataTransformation}
            >
                <D2Shim d2Config={d2Config}>
                    {({ d2 }) => {
                        if (!d2) {
                            // TODO: Handle errors in d2 initialization
                            return null
                        }
                        return (
                            <SystemSettingsProvider>
                                <UserSettingsProvider>
                                    <WindowDimensionsProvider>
                                        <App />
                                    </WindowDimensionsProvider>
                                </UserSettingsProvider>
                            </SystemSettingsProvider>
                        )
                    }}
                </D2Shim>
            </CachedDataQueryProvider>
        </ReduxProvider>
    )
}

export default AppWrapper
