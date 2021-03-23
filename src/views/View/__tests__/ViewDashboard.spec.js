import React from 'react'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import { ViewDashboard } from '../ViewDashboard'
import { apiPostDataStatistics } from '../../../api/dataStatistics'

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useEffect: f => f(),
}))

jest.mock(
    '../ViewControlBar/DashboardsBar',
    () =>
        function MockDashboardsBar() {
            return <div>MockDashboardsBar</div>
        }
)
jest.mock(
    '../ViewTitleBar',
    () =>
        function MockViewTitleBar() {
            return <div>MockViewTitleBar</div>
        }
)
jest.mock(
    '../FilterBar/FilterBar',
    () =>
        function MockFilterBar() {
            return <div>MockFilterBar</div>
        }
)

jest.mock(
    '../ViewItemGrid',
    () =>
        function MockViewItemGrid() {
            return <div>MockViewItemGrid</div>
        }
)

jest.mock('../../../api/dataStatistics', () => ({
    apiPostDataStatistics: jest.fn(() => {
        return new Promise(resolve => resolve(true))
    }),
}))

describe('ViewDashboard', () => {
    let props

    beforeEach(() => {
        props = {
            clearEditDashboard: jest.fn(),
            clearPrintDashboard: jest.fn(),
            registerPassiveView: jest.fn(),
            dashboardIsEditing: false,
            dashboardIsPrinting: false,
        }
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders correctly default', () => {
        const tree = mount(<ViewDashboard {...props} />)
        expect(toJson(tree)).toMatchSnapshot()
    })

    it('clears edit dashboard after redirecting from Edit mode', () => {
        props.dashboardIsEditing = true
        mount(<ViewDashboard {...props} />)
        expect(props.clearEditDashboard).toHaveBeenCalled()
        expect(props.clearPrintDashboard).not.toHaveBeenCalled()
    })

    it('clears print dashboard after redirecting from Print mode', () => {
        props.dashboardIsPrinting = true
        mount(<ViewDashboard {...props} />)
        expect(props.clearEditDashboard).not.toHaveBeenCalled()
        expect(props.clearPrintDashboard).toHaveBeenCalled()
    })

    it('does not post passive view to api if passive view has been registered', () => {
        props.passiveViewRegistered = true
        mount(<ViewDashboard {...props} />)
        expect(apiPostDataStatistics).not.toHaveBeenCalled()
    })

    it('posts passive view to api if passive view has not been registered', () => {
        props.passiveViewRegistered = false
        mount(<ViewDashboard {...props} />)
        expect(apiPostDataStatistics).toHaveBeenCalled()
    })
})
