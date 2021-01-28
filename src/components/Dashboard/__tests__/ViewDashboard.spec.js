import React from 'react'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import { ViewDashboard } from '../ViewDashboard'
import WindowDimensionsProvider from '../../WindowDimensionsProvider'

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useEffect: f => f(),
}))

jest.mock(
    '../../ControlBar/DashboardsBar',
    () =>
        function MockDashboardsBar() {
            return <div>MockDashboardsBar</div>
        }
)
jest.mock(
    '../../TitleBar/ViewTitleBar',
    () =>
        function MockViewTitleBar() {
            return <div>MockViewTitleBar</div>
        }
)
jest.mock(
    '../../FilterBar/FilterBar',
    () =>
        function MockFilterBar() {
            return <div>MockFilterBar</div>
        }
)
jest.mock(
    '../../ItemGrid/ItemGrid',
    () =>
        function MockViewItemGrid() {
            return <div>MockViewItemGrid</div>
        }
)

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
        const tree = mount(
            <WindowDimensionsProvider>
                <ViewDashboard {...props} />
            </WindowDimensionsProvider>
        )
        expect(toJson(tree)).toMatchSnapshot()
    })

    it('clears edit dashboard after redirecting from Edit mode', () => {
        props.dashboardIsEditing = true
        mount(
            <WindowDimensionsProvider>
                <ViewDashboard {...props} />
            </WindowDimensionsProvider>
        )
        expect(props.clearEditDashboard).toHaveBeenCalled()
        expect(props.clearPrintDashboard).not.toHaveBeenCalled()
    })

    it('clears print dashboard after redirecting from Print mode', () => {
        props.dashboardIsPrinting = true
        mount(
            <WindowDimensionsProvider>
                <ViewDashboard {...props} />
            </WindowDimensionsProvider>
        )
        expect(props.clearEditDashboard).not.toHaveBeenCalled()
        expect(props.clearPrintDashboard).toHaveBeenCalled()
    })
})
