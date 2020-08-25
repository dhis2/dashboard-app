import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { EditDashboard } from '../EditDashboard'

jest.mock('../DashboardVerticalOffset', () => 'DashboardVerticalOffset')
jest.mock('../../ControlBar/EditBar', () => 'EditBar')
jest.mock('../../TitleBar/TitleBar', () => 'TitleBar')
jest.mock('../../ItemGrid/ItemGrid', () => 'ItemGrid')
jest.mock('../../../widgets/NoContentMessage', () => 'NoContentMessage')
jest.mock('../PrintLayoutDashboard', () => 'LayoutPrintPreview')

describe('EditDashboard', () => {
    let props

    beforeEach(() => {
        props = {
            dashboard: undefined,
            id: undefined,
            updateAccess: true,
            items: undefined,
            dashboardsLoaded: undefined,
            isPrintPreviewView: undefined,
        }
    })

    it('renders message when not enough access', () => {
        props.updateAccess = false
        const tree = shallow(<EditDashboard {...props} />)
        expect(toJson(tree)).toMatchSnapshot()
    })

    it('renders message when enough access', () => {
        const tree = shallow(<EditDashboard {...props} />)
        expect(toJson(tree)).toMatchSnapshot()
    })

    it('renders print preview', () => {
        props.isPrintPreviewView = true
        const tree = shallow(<EditDashboard {...props} />)
        expect(toJson(tree)).toMatchSnapshot()
    })
})
