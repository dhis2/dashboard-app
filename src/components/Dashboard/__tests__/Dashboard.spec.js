import React from 'react'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'

import { Dashboard } from '../Dashboard'
import WindowDimensionsProvider from '../../WindowDimensionsProvider'
import { NEW, VIEW, EDIT, PRINT, PRINT_LAYOUT } from '../dashboardModes'
import { NON_EXISTING_DASHBOARD_ID } from '../../../reducers/selected'

jest.mock(
    '../PrintLayoutDashboard',
    () =>
        function MockPrintLayoutDashboard() {
            return <div>MockPrintLayoutDashboard</div>
        }
)

jest.mock(
    '../PrintDashboard',
    () =>
        function MockPrintDashboard() {
            return <div>MockPrintDashboard</div>
        }
)
jest.mock(
    '../NewDashboard',
    () =>
        function MockNewDashboard() {
            return <div>MockNewDashboard</div>
        }
)
jest.mock(
    '../EditDashboard',
    () =>
        function MockEditDashboard() {
            return <div>MockEditDashboard</div>
        }
)
jest.mock(
    '../ViewDashboard',
    () =>
        function MockViewDashboard() {
            return <div>MockViewDashboard</div>
        }
)
jest.mock(
    '../../../widgets/NoContentMessage',
    () =>
        function MockNoContentMessage() {
            return <div>MockNoContentMessage</div>
        }
)
jest.mock(
    '../../ControlBar/DashboardsBar',
    () =>
        function MockDashboardsBar() {
            return <div>MockDashboardsBar</div>
        }
)

jest.mock('@dhis2/ui', () => {
    return {
        Layer: () =>
            function MockLayer() {
                return <div className="mock-layer" />
            },
        CenteredContent: () =>
            function MockCenteredContent() {
                return <div className="mock-centered-content" />
            },
        CircularLoader: () =>
            function CircularLoader() {
                return <div className="mock-circular-loader" />
            },
    }
})

describe('Dashboard', () => {
    let props
    let shallowDashboard
    const dashboard = () => {
        if (!shallowDashboard) {
            shallowDashboard = mount(
                <WindowDimensionsProvider>
                    <Dashboard {...props} />
                </WindowDimensionsProvider>
            )
        }
        return shallowDashboard
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

    beforeEach(() => {
        props = {
            dashboardsIsEmpty: false,
            dashboardsLoaded: false,
            id: null,
            match: { params: { dashboardId: null } },
            mode: VIEW,
            selectDashboard: jest.fn(),
        }
        shallowDashboard = undefined
    })
    it('renders correctly when dashboards not loaded and id is null', () => {
        expect(toJson(dashboard())).toMatchSnapshot()
    })

    it('renders correctly when dashboards loaded and id is null', () => {
        props.dashboardsLoaded = true
        expect(toJson(dashboard())).toMatchSnapshot()
    })

    it('renders correctly when dashboards not loaded and id is not null', () => {
        props.id = 'rainbowdash'
        expect(toJson(dashboard())).toMatchSnapshot()
    })

    it('renders NEW dashboard', () => {
        props.dashboardsLoaded = true
        props.id = 'rainbowdash'
        props.mode = NEW
        expect(toJson(dashboard())).toMatchSnapshot()
    })

    it('renders correctly when no dashboards found', () => {
        props.dashboardsLoaded = true
        props.dashboardsIsEmpty = true
        props.id = 'rainbowdash'
        props.mode = VIEW
        expect(toJson(dashboard())).toMatchSnapshot()
    })

    it('renders correctly when dashboard id is not valid', () => {
        props.dashboardsLoaded = true
        props.id = NON_EXISTING_DASHBOARD_ID
        props.mode = VIEW
        expect(toJson(dashboard())).toMatchSnapshot()
    })

    it('renders EDIT dashboard', () => {
        props.dashboardsLoaded = true
        props.id = 'rainbowdash'
        props.mode = EDIT
        expect(toJson(dashboard())).toMatchSnapshot()
    })

    it('renders PRINT dashboard', () => {
        props.dashboardsLoaded = true
        props.id = 'rainbowdash'
        props.mode = PRINT
        expect(toJson(dashboard())).toMatchSnapshot()
    })

    it('renders PRINT_LAYOUT dashboard', () => {
        props.dashboardsLoaded = true
        props.id = 'rainbowdash'
        props.mode = PRINT_LAYOUT
        expect(toJson(dashboard())).toMatchSnapshot()
    })
})
