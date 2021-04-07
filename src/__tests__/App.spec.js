import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { render } from '@testing-library/react'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { useUserSettings } from '../components/UserSettingsProvider'
import { apiFetchDimensions } from '@dhis2/analytics'
import { apiFetchDashboards } from '../api/fetchAllDashboards'
import App from '../App'

jest.mock('../api/fetchAllDashboards')
jest.mock('../components/UserSettingsProvider')
jest.mock('@dhis2/analytics')
jest.mock('@dhis2/app-runtime-adapter-d2')
jest.mock(
    '../components/Dashboard',
    () =>
        function MockDashboard() {
            return <div className="dashboard" />
        }
)

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

test('renders the app', () => {
    useD2.mockReturnValue({
        d2: {
            currentUser: 'rainbowDash',
        },
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
    apiFetchDimensions.mockReturnValue([{ dimensionType: 'mock' }])
    const store = {
        settings: {},
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <header style={{ height: '48px' }} />
            <App />
        </Provider>
    )
    expect(container).toMatchSnapshot()
    expect(apiFetchDashboards).toHaveBeenCalledTimes(1)
})
