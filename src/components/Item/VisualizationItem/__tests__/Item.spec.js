import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { CHART } from '../../../../modules/itemTypes'
import { Item } from '../Item'

jest.mock('../ItemFooter', () => 'ItemFooter')
jest.mock('../Visualization/Visualization', () => 'VisualizationComponent')

const mockHeaderRef = { clientHeight: 50 }

describe('VisualizationItem/Item', () => {
    let props
    let shallowItem

    const canvas = () => {
        if (!shallowItem) {
            shallowItem = shallow(<Item {...props} />, { context: { d2: {} } })
        }
        return shallowItem
    }

    beforeEach(() => {
        props = {
            activeType: null,
            dashboardMode: 'view',
            isEditing: false,
            item: {},
            itemFilters: {
                brilliance: [{ id: 100, name: '100' }],
            },
            setActiveType: jest.fn(),
            updateVisualization: jest.fn(),
            visualization: {
                id: 'vis id',
            },
            onToggleItemExpanded: jest.fn(),
        }
        shallowItem = undefined
    })

    it('renders an Item with a Visualization', () => {
        props.item.type = CHART
        props.item.chart = {
            id: 'chart1',
            name: 'Test chart',
        }

        const component = canvas()

        component.instance().headerRef.current = mockHeaderRef

        component.setState({ configLoaded: true })

        const vis = component.find('VisualizationComponent')

        expect(vis.exists()).toBeTruthy()
        expect(vis.prop('item')).toEqual({
            type: CHART,
            chart: { id: 'chart1', name: 'Test chart' },
        })
    })

    it('does not render Visualization if config not loaded', () => {
        props.item.type = CHART
        props.item.id = 'chart-item-1'
        props.item.chart = {
            id: 'chart1',
            name: 'Test chart',
        }
        expect(toJson(canvas())).toMatchSnapshot()
    })
})
