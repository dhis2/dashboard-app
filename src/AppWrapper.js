import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import dhis2theme from '@dhis2/d2-ui-core/theme/mui3.theme'
import { Provider as ReduxProvider } from 'react-redux'
// import { D2Shim } from '@dhis2/app-runtime-adapter-d2'

import { D2Shim } from './D2Shim'
import App from './components/App'
import configureStore from './configureStore'

import './index.css'
import './locales'

const muiTheme = () => createMuiTheme(dhis2theme)

const schemas = [
    'chart',
    'map',
    'report',
    'reportTable',
    'eventChart',
    'eventReport',
    'dashboard',
    'organisationUnit',
    'userGroup',
]

const appConfig = {
    schemas,
    i18nRoot: './i18n',
}

const authorization = process.env.REACT_APP_DHIS2_AUTHORIZATION || null

// TODO: ER and EV plugins require the auth header in development mode.
// Remove this when these plugins are rewritten
if (authorization) {
    appConfig.headers = { Authorization: authorization }
}

const AppWrapper = () => {
    return (
        <ReduxProvider store={configureStore()}>
            <MuiThemeProvider theme={muiTheme()}>
                <D2Shim appConfig={appConfig}>
                    {({ d2 }) => {
                        if (!d2) {
                            // TODO: Handle errors in d2 initialization
                            return null
                        }
                        return <App d2={d2} />
                    }}
                </D2Shim>
            </MuiThemeProvider>
        </ReduxProvider>
    )
}

export default AppWrapper
