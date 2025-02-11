import { CachedDataQueryProvider } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import App from './components/App.js'
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
    const dataVisualizerApp =
        apps.find((app) => app.key === 'data-visualizer') || {}
    const lineListingApp = apps.find((app) => app.key === 'line-listing') || {}
    const mapsApp = apps.find((app) => app.key === 'maps') || {}

    return {
        rootOrgUnits: rootOrgUnits.organisationUnits,
        dataVisualizerAppVersion: dataVisualizerApp.version || '0.0.0',
        lineListingAppVersion: lineListingApp.version || '0.0.0',
        mapsAppVersion: mapsApp.version || '0.0.0',
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
                <SystemSettingsProvider>
                    <UserSettingsProvider>
                        <WindowDimensionsProvider>
                            <App />
                        </WindowDimensionsProvider>
                    </UserSettingsProvider>
                </SystemSettingsProvider>
            </CachedDataQueryProvider>
        </ReduxProvider>
    )
}

export default AppWrapper
