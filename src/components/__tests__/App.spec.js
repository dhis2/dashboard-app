import { render } from '@testing-library/react'
import React from 'react'
import { act } from 'react-dom/test-utils.js'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { apiFetchDashboards } from '../../api/fetchAllDashboards'
import App from '../App'
import { useSystemSettings } from '../SystemSettingsProvider'

jest.mock('@dhis2/analytics')
jest.mock('@dhis2/app-runtime', () => ({
    useOnlineStatus: jest.fn(() => ({ online: true, offline: false })),
    useDataEngine: jest.fn(() => ({ query: Function.prototype })),
    useCacheableSection: jest.fn,
}))

jest.mock('../../api/fetchAllDashboards', () => {
    return {
        apiFetchDashboards: jest.fn(() => [
            {
                id: 'rainbowdash',
                displayName: 'Rainbow Dash',
                starred: true,
            },
        ]),
    }
})

jest.mock('../../api/dataStatistics', () => {
    return {
        apiGetDataStatistics: jest.fn(() => ({
            dashboard: [
                {
                    id: 'rainbowdash',
                    name: 'Rainbow Dash name',
                    starred: true,
                },
            ],
        })),
    }
})

jest.mock(
    '../DashboardsBar/DashboardsBar',
    () =>
        function MockDashboardsBar() {
            return <div>DashboardsBar</div>
        }
)

jest.mock('@dhis2/app-runtime-adapter-d2', () => {
    return {
        useD2: jest.fn(() => ({
            d2: {
                currentUser: {
                    username: 'rainbowDash',
                },
            },
        })),
    }
})
jest.mock('../../pages/view', () => {
    return {
        ViewDashboard: function MockDashboard() {
            return <div className="viewdashboard" />
        },
    }
})

jest.mock('../SystemSettingsProvider', () => {
    return {
        __esModule: true,
        default: jest.fn(children => <div>{children}</div>),
        useSystemSettings: jest.fn(() => ({
            systemSettings: { startModuleEnableLightweight: false },
        })),
    }
})

jest.mock('../UserSettingsProvider', () => {
    return {
        __esModule: true,
        default: jest.fn(children => <div>{children}</div>),
        useUserSettings: jest.fn(() => ({
            userSettings: { keyAnalysisDisplayProperty: 'displayName' },
        })),
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

const dataEngine = {}
const middlewares = [thunk.withExtraArgument(dataEngine)]
const mockStore = configureMockStore(middlewares)

test('renders the app with a dashboard', () => {
    useSystemSettings.mockReturnValue({
        systemSettings: { startModuleEnableLightweight: false },
    })
    const { container } = render(
        <>
            <header style={{ height: '48px' }} />
            <Provider store={mockStore({ controlBar: { userRows: 1 } })}>
                <App />
            </Provider>
        </>
    )
    expect(container).toMatchSnapshot()
    expect(apiFetchDashboards).toHaveBeenCalledTimes(1)
    jest.clearAllMocks()
})

test('renders the app with the start page', async () => {
    const promise = Promise.resolve()
    useSystemSettings.mockReturnValue({
        systemSettings: { startModuleEnableLightweight: true },
    })
    const { container } = render(
        <>
            <header style={{ height: '48px' }} />
            <Provider store={mockStore({ controlBar: { userRows: 1 } })}>
                <App />
            </Provider>
        </>
    )
    await act(() => promise)
    expect(container).toMatchSnapshot()
    expect(apiFetchDashboards).toHaveBeenCalledTimes(1)
    jest.clearAllMocks()
})
