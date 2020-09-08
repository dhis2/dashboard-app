import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { ViewDashboard } from '../ViewDashboard'

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useEffect: f => f(),
}))

jest.mock('../../ControlBar/DashboardsBar', () => 'DashboardsBar')
jest.mock('../DashboardVerticalOffset', () => 'DashboardVerticalOffset')
jest.mock('../../TitleBar/TitleBar', () => 'TitleBar')
jest.mock('../../FilterBar/FilterBar', () => 'FilterBar')
jest.mock('../../ItemGrid/ItemGrid', () => 'ItemGrid')

describe('ViewDashboard', () => {
    let props

    beforeEach(() => {
        props = {
            clearEditDashboard: jest.fn(),
            clearPrintDashboard: jest.fn(),
            dashboardIsEditing: false,
            dashboardIsPrinting: false,
            controlBarRows: 2,
            windowHeight: 600,
        }
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders correctly default', () => {
        const tree = shallow(<ViewDashboard {...props} />)
        expect(toJson(tree)).toMatchSnapshot()
    })

    it('clears edit dashboard after redirecting from Edit mode', () => {
        props.dashboardIsEditing = true
        shallow(<ViewDashboard {...props} />)
        expect(props.clearEditDashboard).toHaveBeenCalled()
        expect(props.clearPrintDashboard).not.toHaveBeenCalled()
    })

    it('clears print dashboard after redirecting from Print mode', () => {
        props.dashboardIsPrinting = true
        shallow(<ViewDashboard {...props} />)
        expect(props.clearEditDashboard).not.toHaveBeenCalled()
        expect(props.clearPrintDashboard).toHaveBeenCalled()
    })
})
