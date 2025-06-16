import { useDataEngine } from '@dhis2/app-runtime'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import App from './components/App.jsx'
import AppDataProvider from './components/AppDataProvider/AppDataProvider.jsx'
import WindowDimensionsProvider from './components/WindowDimensionsProvider.jsx'
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
