import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { MIN_ROW_COUNT } from '../controlBarDimensions'
import { DashboardsBar, MAX_ROW_COUNT } from '../DashboardsBar'
import ShowMoreButton from '../ShowMoreButton'
import * as api from '../../../api/controlBar'

describe('DashboardsBar', () => {
    let props
    let shallowDashboardsBar
    const dashboardsBar = () => {
        if (!shallowDashboardsBar) {
            shallowDashboardsBar = shallow(<DashboardsBar {...props} />)
        }
        return shallowDashboardsBar
    }

    beforeEach(() => {
        props = {
            dashboards: {},
            filterText: '',
            history: {},
            selectedId: null,
            userRows: MIN_ROW_COUNT,
            onChangeHeight: undefined,
        }
        shallowDashboardsBar = undefined
    })

    it('renders a DashboardsBar with no items', () => {
        expect(toJson(dashboardsBar())).toMatchSnapshot()
    })

    it('does not render ShowMoreButton when userRows is MAX_ROW_COUNT', () => {
        props.userRows = MAX_ROW_COUNT
        expect(toJson(dashboardsBar())).toMatchSnapshot()
    })

    it('renders ShowMoreButton when userRows is less than MAX_ROW_COUNT', () => {
        props.userRows = MAX_ROW_COUNT - 1
        expect(toJson(dashboardsBar())).toMatchSnapshot()
    })

    describe('when ShowMore button is toggled', () => {
        it('sets the correct value for isMaxHeight property', () => {
            const bar = dashboardsBar()
            const btn = bar.find(ShowMoreButton)
            btn.simulate('click')
            const rerenderedBtn = bar.find(ShowMoreButton)

            expect(btn.props().isMaxHeight).not.toEqual(
                rerenderedBtn.props().isMaxHeight
            )
        })
    })

    it('calls the api to post user rows when drag ends', () => {
        const spy = jest.spyOn(api, 'apiPostControlBarRows')

        const controlBar = dashboardsBar()
        controlBar.simulate('endDrag')

        expect(spy).toHaveBeenCalled()
    })

    it('triggers onChangeHeight when controlbar height is changed', () => {
        props.onChangeHeight = jest.fn()
        props.userRows = MAX_ROW_COUNT - 1
        const dbr = dashboardsBar()

        const newPixelHeight = 200 // should be equivalent to 3 rows
        dbr.simulate('changeHeight', newPixelHeight)
        expect(props.onChangeHeight).toHaveBeenCalled()
        expect(props.onChangeHeight).toHaveBeenCalledWith(3)
    })

    it('does not trigger onChangeHeight when controlbar height is changed to similar value', () => {
        props.onChangeHeight = jest.fn()
        props.userRows = MIN_ROW_COUNT

        const dbr = dashboardsBar()

        const newPixelHeight = 50 //should result in 1 row, same as current
        dbr.simulate('changeHeight', newPixelHeight)
        expect(props.onChangeHeight).not.toHaveBeenCalled()
    })

    describe('when dashboards are provided', () => {
        beforeEach(() => {
            props.dashboards = {
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
            }
        })

        it('renders DashboardItemChips for each item on dashboard', () => {
            expect(toJson(dashboardsBar())).toMatchSnapshot()
        })

        it('renders correctly for selected item', () => {
            props.selectedId = 'fluttershy123'
            expect(toJson(dashboardsBar())).toMatchSnapshot()
        })
    })
})
