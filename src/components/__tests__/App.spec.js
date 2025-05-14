import { render, act } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { apiFetchDashboards } from '../../api/fetchAllDashboards.js'
import App from '../App.js'
import { useSystemSettings } from '../AppDataProvider/AppDataProvider.js'

jest.mock('@dhis2/analytics', () => ({
    useCachedDataQuery: () => ({
        currentUser: {
            username: 'rainbowDash',
            id: 'r3nb0d5h',
        },
    }),
    getDimensionById: jest.fn(),
}))
jest.mock('@dhis2/app-runtime', () => ({
    useDhis2ConnectionStatus: jest.fn(() => ({
        isConnected: true,
        isDisconnected: false,
    })),
    useDataEngine: jest.fn(() => ({ query: Function.prototype })),
    useCacheableSection: jest.fn,
}))

jest.mock('../../api/fetchAllDashboards.js', () => {
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

jest.mock('../../api/dataStatistics.js', () => {
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

jest.mock('../../api/description.js', () => {
    return {
        apiGetShowDescription: jest.fn(() => ({
            showDescription: 'false',
        })),
    }
})

jest.mock(
    '../DashboardsBar/index.js',
    () =>
        function MockDashboardsBar() {
            return <div>DashboardsBar</div>
        }
)

jest.mock('../../pages/view', () => {
    return {
        ViewDashboard: function Mock() {
            return <div className="viewdashboard" />
        },
    }
})

jest.mock('../AppDataProvider/AppDataProvider', () => {
    return {
        ...jest.requireActual('../AppDataProvider/AppDataProvider'),
        __esModule: true,
        useSystemSettings: jest.fn(() => ({
            startModuleEnableLightweight: false,
        })),
        useUserSettings: jest.fn(() => ({
            keyAnalysisDisplayProperty: 'displayName',
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
    useSystemSettings.mockReturnValue({ startModuleEnableLightweight: false })
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
    useSystemSettings.mockReturnValue({ startModuleEnableLightweight: true })
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
