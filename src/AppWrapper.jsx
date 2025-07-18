import { useDataEngine } from '@dhis2/app-runtime'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import App from './components/App.jsx'
import AppDataProvider from './components/AppDataProvider/AppDataProvider.jsx'
import WindowDimensionsProvider from './components/WindowDimensionsProvider.jsx'
import configureStore from './configureStore.js'

import './locales/index.js'

/** global needs to be defined because the legacy plugins
 * for event visualization and event reports are on it.
 **/
if (typeof global === 'undefined') {
    window.global = window
}

const AppWrapper = () => {
    const dataEngine = useDataEngine()

    return (
        <ReduxProvider store={configureStore(dataEngine)}>
            <AppDataProvider>
                <WindowDimensionsProvider>
                    <App />
                </WindowDimensionsProvider>
            </AppDataProvider>
        </ReduxProvider>
    )
}

export default AppWrapper
