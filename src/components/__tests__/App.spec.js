import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { apiFetchDashboards } from '../../api/fetchAllDashboards'
import App from '../App'
import { useSystemSettings } from '../SystemSettingsProvider'
import { useUserSettings } from '../UserSettingsProvider'

jest.mock('../../api/fetchAllDashboards')
jest.mock('../SystemSettingsProvider')
jest.mock('../UserSettingsProvider')
jest.mock('@dhis2/analytics')
jest.mock('@dhis2/app-runtime-adapter-d2')
jest.mock('../../pages/view', () => {
    return {
        ViewDashboard: function MockDashboard() {
            return <div className="viewdashboard" />
        },
    }
})

jest.mock('../../pages/edit', () => {
    return {
        NewDashboard: function MockDashboard() {
            return <div className="newdashboard" />
        },

        EditDashboard: function MockDashboard() {
            return <div className="editdashboard" />
        },
    }
})

jest.mock('../../pages/print', () => {
    return {
        PrintDashboard: function MockDashboard() {
            return <div className="printdashboard" />
        },

        PrintLayoutDashboard: function MockDashboard() {
            return <div className="printlayoutdashboard" />
        },
    }
})

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

test('renders the app', () => {
    useD2.mockReturnValue({
        d2: {
            currentUser: 'rainbowDash',
        },
    })

    useSystemSettings.mockReturnValue({
        systemSettings: { startModuleEnableLightweight: true },
    })

    useUserSettings.mockReturnValue({
        userSettings: { keyAnalysisDisplayProperty: 'displayName' },
    })

    apiFetchDashboards.mockReturnValue([
        {
            id: 'rainbowdash',
            displayName: 'Rainbow Dash',
            starred: true,
        },
    ])

    const { container } = render(
        <>
            <header style={{ height: '48px' }} />
            <Provider store={mockStore({})}>
                <App />
            </Provider>
        </>
    )
    expect(container).toMatchSnapshot()
    expect(apiFetchDashboards).toHaveBeenCalledTimes(1)
})
