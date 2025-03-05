import { CachedDataQueryProvider } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import App from './components/App.js'
import InstalledAppsProvider from './components/InstalledAppsProvider.js'
import SystemSettingsProvider from './components/SystemSettingsProvider.js'
import UserSettingsProvider from './components/UserSettingsProvider.js'
import WindowDimensionsProvider from './components/WindowDimensionsProvider.js'
import configureStore from './configureStore.js'

import './locales/index.js'

const query = {
    rootOrgUnits: {
        resource: 'organisationUnits',
        params: {
            fields: 'id,displayName,name',
            userDataViewFallback: true,
            paging: false,
        },
    },
    currentUser: {
        resource: 'me',
        params: {
            fields: 'id,username,displayName~rename(name),authorities,settings[keyAnalysisDisplayProperty]',
        },
    },
}

const providerDataTransformation = ({ rootOrgUnits, currentUser }) => ({
    rootOrgUnits: rootOrgUnits.organisationUnits,
    currentUser,
})

const AppWrapper = () => {
    const dataEngine = useDataEngine()

    return (
        <ReduxProvider store={configureStore(dataEngine)}>
            <CachedDataQueryProvider
                query={query}
                dataTransformation={providerDataTransformation}
            >
                <InstalledAppsProvider>
                    <SystemSettingsProvider>
                        <UserSettingsProvider>
                            <WindowDimensionsProvider>
                                <App />
                            </WindowDimensionsProvider>
                        </UserSettingsProvider>
                    </SystemSettingsProvider>
                </InstalledAppsProvider>
            </CachedDataQueryProvider>
        </ReduxProvider>
    )
}

export default AppWrapper
