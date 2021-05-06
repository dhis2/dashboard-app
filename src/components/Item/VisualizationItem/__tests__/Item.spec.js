import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { CHART } from '../../../../modules/itemTypes'
import { Item } from '../Item'

jest.mock('../ItemFooter', () => 'ItemFooter')
jest.mock('../Visualization/Visualization', () => 'VisualizationComponent')

describe('VisualizationItem/Item', () => {
    let props
    let shallowItem

    const canvas = () => {
        if (!shallowItem) {
            shallowItem = shallow(<Item {...props} />)
        }
        return shallowItem
    }

    beforeEach(() => {
        props = {
            activeType: null,
            dashboardMode: 'view',
            isEditing: false,
            item: {},
            visualization: {
                id: 'vis id',
            },
        }
        shallowItem = undefined
    })

    it.skip('does not render Visualization if config not loaded', () => {
        props.item.type = CHART
        props.item.chart = {
            id: 'chart1',
            name: 'Test chart',
        }
        expect(toJson(canvas())).toMatchSnapshot()
    })
})
