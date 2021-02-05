import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { render } from '@testing-library/react'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { apiFetchDimensions } from '@dhis2/analytics'
import { apiFetchDashboards } from '../../api/dashboards'
import App from '../App'

jest.mock('../../api/dashboards')
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
    apiFetchDashboards.mockReturnValue([
        {
            id: 'rainbowdash',
            name: 'Rainbow Dash',
            dashboardItems: [],
            user: {},
            created: 'today',
            lastUpdated: 'today',
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
    expect(apiFetchDashboards).toHaveBeenCalledTimes(1)
})
