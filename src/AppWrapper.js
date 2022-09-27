import { CachedDataQueryProvider } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import { D2Shim } from '@dhis2/app-runtime-adapter-d2'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import App from './components/App'
import SystemSettingsProvider from './components/SystemSettingsProvider'
import UserSettingsProvider from './components/UserSettingsProvider'
import WindowDimensionsProvider from './components/WindowDimensionsProvider'
import configureStore from './configureStore'

import './locales'

const d2Config = {
    schemas: [
        'visualization',
        'map',
        'report',
        'eventChart',
        'eventReport',
        'dashboard',
        'organisationUnit',
        'userGroup',
    ],
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
}

const providerDataTransformation = ({ rootOrgUnits }) => ({
    rootOrgUnits: rootOrgUnits.organisationUnits,
})

const AppWrapper = () => {
    const dataEngine = useDataEngine()

    return (
        <ReduxProvider store={configureStore(dataEngine)}>
            <CachedDataQueryProvider
                query={query}
                dataTransformation={providerDataTransformation}
            >
                <D2Shim d2Config={d2Config} i18nRoot="./i18n">
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
