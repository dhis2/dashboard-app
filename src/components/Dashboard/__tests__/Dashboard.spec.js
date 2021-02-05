import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import thunk from 'redux-thunk'
import { useDataEngine } from '@dhis2/app-runtime'

import Dashboard from '../Dashboard'
import WindowDimensionsProvider from '../../WindowDimensionsProvider'
import { NEW, VIEW, EDIT, PRINT, PRINT_LAYOUT } from '../dashboardModes'
import { NON_EXISTING_DASHBOARD_ID } from '../../../reducers/selected'
import { apiFetchDashboard } from '../../../api/dashboards'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

jest.mock('@dhis2/app-runtime')
jest.mock('../../../api/dashboards')
jest.mock(
    '../PrintLayoutDashboard',
    () =>
        function MockComponent() {
            return <div>PrintLayoutDashboard</div>
        }
)

jest.mock(
    '../PrintDashboard',
    () =>
        function MockComponent() {
            return <div>PrintDashboard</div>
        }
)

jest.mock(
    '../NewDashboard',
    () =>
        function MockComponent() {
            return <div>NewDashboard</div>
        }
)
jest.mock(
    '../EditDashboard',
    () =>
        function MockComponent() {
            return <div>EditDashboard</div>
        }
)
jest.mock(
    '../ViewDashboard',
    () =>
        function MockComponent() {
            return <div>ViewDashboard</div>
        }
)
/* eslint-disable react/prop-types */
jest.mock(
    '../../../widgets/NoContentMessage',
    () =>
        function MockComponent({ text }) {
            return <div>{text}</div>
        }
)
/* eslint-enable react/prop-types */
jest.mock(
    '../../ControlBar/DashboardsBar',
    () =>
        function MockComponent() {
            return <div>DashboardsBar</div>
        }
)
jest.mock('@dhis2/ui', () => ({
    __esModule: true,
    Layer: function MockComponent() {
        return <div>Layer</div>
    },
    CenteredContent: function MockComponent() {
        return <div>CenteredContent</div>
    },
    CircularLoader: function MockComponent() {
        return <div>CircularLoader</div>
    },
}))

useDataEngine.mockReturnValue({
    dataEngine: {},
})

const dashboards = {
    byId: {
        rainbow123: {
            id: 'rainbow123',
            displayName: 'Rainbow Dash',
            starred: false,
        },
        fluttershy123: {
            id: 'fluttershy123',
            displayName: 'Fluttershy',
            starred: true,
        },
    },
}

Object.defineProperty(global.document, 'getElementsByTagName', {
    value: () => [
        {
            classList: {
                add: Function.prototype,
                remove: Function.prototype,
            },
        },
    ],
})

Object.defineProperty(global.window, 'scrollTo', {
    value: Function.prototype,
})

describe('Dashboard', () => {
    it('renders Loading indicator when dashboards not loaded', () => {
        const store = {
            dashboards: { byId: null },
            selected: { id: null },
            user: {
                id: '135',
                username: 'test',
            },
        }

        const match = {
            params: { dashboardId: null },
        }

        apiFetchDashboard.mockReturnValue({
            id: 'rainbow123',
            displayName: 'Rainbow Dash',
            starred: false,
            dashboardItems: [],
            user: {},
            created: 'today',
            lastUpdated: 'today',
        })

        const { container } = render(
            <Provider store={mockStore(store)}>
                <WindowDimensionsProvider>
                    <Router history={createMemoryHistory()}>
                        <Dashboard mode={VIEW} match={match} />
                    </Router>
                </WindowDimensionsProvider>
            </Provider>
        )

        expect(container).toMatchSnapshot()
    })

    //it.skip('renders Redirect', () => {
    // })

    it('renders NEW dashboard', () => {
        const store = {
            dashboards,
            selected: { id: 'rainbow123' },
            user: {
                id: '135',
                username: 'test',
            },
        }

        const match = {
            params: { dashboardId: null },
        }

        apiFetchDashboard.mockReturnValue({
            id: 'rainbow123',
            displayName: 'Rainbow Dash',
            starred: false,
            dashboardItems: [],
            user: {},
            created: 'today',
            lastUpdated: 'today',
        })

        const { container } = render(
            <Provider store={mockStore(store)}>
                <WindowDimensionsProvider>
                    <Router history={createMemoryHistory()}>
                        <Dashboard mode={NEW} match={match} />
                    </Router>
                </WindowDimensionsProvider>
            </Provider>
        )

        expect(container).toMatchSnapshot()
    })

    it('renders No Dashboards message when no dashboards and mode != NEW', () => {
        const store = {
            dashboards: { byId: {} },
            selected: { id: null },
            user: {
                id: '135',
                username: 'test',
            },
        }

        const match = {
            params: { dashboardId: null },
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <WindowDimensionsProvider>
                    <Router history={createMemoryHistory()}>
                        <Dashboard mode={VIEW} match={match} />
                    </Router>
                </WindowDimensionsProvider>
            </Provider>
        )

        expect(container).toMatchSnapshot()
    })

    it('renders Loading indicator when dashboards loaded and id is still null', () => {
        const store = {
            dashboards,
            selected: { id: null },
            user: {
                id: '135',
                username: 'test',
            },
        }

        apiFetchDashboard.mockReturnValue({
            id: 'rainbow123',
            displayName: 'Rainbow Dash',
            starred: false,
            dashboardItems: [],
            user: {},
            created: 'today',
            lastUpdated: 'today',
        })

        const match = {
            params: { dashboardId: 'rainbow123' },
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <WindowDimensionsProvider>
                    <Router history={createMemoryHistory()}>
                        <Dashboard mode={VIEW} match={match} />
                    </Router>
                </WindowDimensionsProvider>
            </Provider>
        )

        expect(container).toMatchSnapshot()
    })

    it('renders Dashboard Not Found message when dashboard id is not valid', () => {
        const store = {
            dashboards,
            selected: { id: NON_EXISTING_DASHBOARD_ID },
            user: {
                id: '135',
                username: 'test',
            },
        }

        const match = {
            params: { dashboardId: 'xyzpdq' },
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <WindowDimensionsProvider>
                    <Router history={createMemoryHistory()}>
                        <Dashboard mode={VIEW} match={match} />
                    </Router>
                </WindowDimensionsProvider>
            </Provider>
        )

        expect(container).toMatchSnapshot()
    })

    it('renders EDIT dashboard', () => {
        const store = {
            dashboards,
            selected: { id: 'rainbow123' },
            user: {
                id: '135',
                username: 'test',
            },
        }

        apiFetchDashboard.mockReturnValue({
            id: 'rainbow123',
            displayName: 'Rainbow Dash',
            starred: false,
            dashboardItems: [],
            user: {},
            created: 'today',
            lastUpdated: 'today',
        })

        const match = {
            params: { dashboardId: 'rainbow123' },
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <WindowDimensionsProvider>
                    <Router history={createMemoryHistory()}>
                        <Dashboard mode={EDIT} match={match} />
                    </Router>
                </WindowDimensionsProvider>
            </Provider>
        )

        expect(container).toMatchSnapshot()
    })

    it('renders PRINT dashboard', () => {
        const store = {
            dashboards,
            selected: { id: 'rainbow123' },
            user: {
                id: '135',
                username: 'test',
            },
        }

        apiFetchDashboard.mockReturnValue({
            id: 'rainbow123',
            displayName: 'Rainbow Dash',
            starred: false,
            dashboardItems: [],
            user: {},
            created: 'today',
            lastUpdated: 'today',
        })

        const match = {
            params: { dashboardId: 'rainbow123' },
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <WindowDimensionsProvider>
                    <Router history={createMemoryHistory()}>
                        <Dashboard mode={PRINT} match={match} />
                    </Router>
                </WindowDimensionsProvider>
            </Provider>
        )

        expect(container).toMatchSnapshot()
    })

    it('renders PRINT_LAYOUT dashboard', () => {
        const store = {
            dashboards,
            selected: { id: 'rainbow123' },
            user: {
                id: '135',
                username: 'test',
            },
        }

        apiFetchDashboard.mockReturnValue({
            id: 'rainbow123',
            displayName: 'Rainbow Dash',
            starred: false,
            dashboardItems: [],
            user: {},
            created: 'today',
            lastUpdated: 'today',
        })

        const match = {
            params: { dashboardId: 'rainbow123' },
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <WindowDimensionsProvider>
                    <Router history={createMemoryHistory()}>
                        <Dashboard mode={PRINT_LAYOUT} match={match} />
                    </Router>
                </WindowDimensionsProvider>
            </Provider>
        )

        expect(container).toMatchSnapshot()
    })
})
