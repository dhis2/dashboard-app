import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { render } from '@testing-library/react'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { useSystemSettings } from '../SystemSettingsProvider'
import { apiFetchDimensions } from '@dhis2/analytics'
import { fetchAllDashboards } from '../../api/fetchAllDashboards'
import App from '../App'

jest.mock('../../api/fetchAllDashboards')
jest.mock('../SystemSettingsProvider')
jest.mock('@dhis2/analytics')
jest.mock('@dhis2/app-runtime-adapter-d2')
jest.mock(
    '../Dashboard/Dashboard',
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
    useSystemSettings.mockReturnValue({
        settings: { displayNameProperty: 'displayName' },
    })
    fetchAllDashboards.mockReturnValue([
        {
            id: 'rainbowdash',
            name: 'Rainbow Dash',
            user: {},
        },
    ])
    apiFetchDimensions.mockReturnValue([{ dimensionType: 'mock' }])
    const store = {
        settings: {},
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <App />
        </Provider>
    )
    expect(container).toMatchSnapshot()
    expect(fetchAllDashboards).toHaveBeenCalledTimes(1)
})
