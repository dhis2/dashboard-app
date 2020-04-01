import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import dhis2theme from '@dhis2/d2-ui-core/theme/mui3.theme'
import { Provider } from '@dhis2/app-runtime'
// import { D2Shim } from '@dhis2/app-runtime-adapter-d2'

import { D2Shim } from './D2Shim'
import App from './components/App'
import configureStore from './configureStore'

import './index.css'

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
const d2Config = {
    schemas,
}

const AppWrapper = () => {
    return (
        <Provider store={configureStore()}>
            <MuiThemeProvider theme={muiTheme()}>
                <D2Shim schemas={schemas}>
                    {params => <App {...params} />}
                </D2Shim>
            </MuiThemeProvider>
        </Provider>
    )
}

export default AppWrapper
