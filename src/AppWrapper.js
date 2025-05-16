import { useDataEngine } from '@dhis2/app-runtime'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import App from './components/App.js'
import AppDataProvider from './components/AppDataProvider/AppDataProvider.js'
import WindowDimensionsProvider from './components/WindowDimensionsProvider.js'
import configureStore from './configureStore.js'

import './locales/index.js'

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
