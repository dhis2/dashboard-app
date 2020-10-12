import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { Dashboard } from '../Dashboard'
import { NEW, VIEW, EDIT, PRINT, PRINT_LAYOUT } from '../dashboardModes'
import { NON_EXISTING_DASHBOARD_ID } from '../../../reducers/selected'

jest.mock('../../ControlBar/DashboardsBar', () => 'DashboardsBar')
jest.mock('../DashboardVerticalOffset', () => 'DashboardVerticalOffset')
jest.mock('../../../widgets/NoContentMessage', () => 'NoContentMessage')
jest.mock('../ViewDashboard', () => 'ViewDashboard')
jest.mock('../EditDashboard', () => 'EditDashboard')
jest.mock('../NewDashboard', () => 'NewDashboard')
jest.mock('../PrintDashboard', () => 'PrintDashboard')
jest.mock('../PrintLayoutDashboard', () => 'PrintLayoutDashboard')

describe('Dashboard', () => {
    let props
    let shallowDashboard
    const dashboard = () => {
        if (!shallowDashboard) {
            shallowDashboard = shallow(<Dashboard {...props} />)
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
        props.id = null
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
